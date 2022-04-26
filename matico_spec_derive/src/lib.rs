extern crate proc_macro;
extern crate syn;
#[macro_use]
extern crate quote;
use proc_macro::TokenStream;

use syn::parse::Parser ;
use syn::{Field,parse_macro_input, };

use syn::DeriveInput;

#[proc_macro_derive(AutoCompleteMe)]
pub fn derive_auto_complete(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);

    let name = &ast.ident;

    let result = quote! {
        impl AutoComplete for #name{
            fn autocomplete_json()->String{
                let default: Self = Default::default();
                serde_json::to_string(&default).unwrap()
            }
        }
    };

    TokenStream::from(result)
}

#[proc_macro_attribute]
pub fn matico_compute(_attr: TokenStream, input:TokenStream)->TokenStream{
    let mut ast = parse_macro_input!(input as DeriveInput);

    // modify the struct deff to include the params we need 
    let out_ast = match &mut ast.data {
        syn::Data::Struct(ref mut struct_data) => {           
            match &mut struct_data.fields {
                syn::Fields::Named(fields) => {
                        fields.named.push(Field::parse_named.parse2(quote!{
                            pub parameter_values: HashMap<String,ParameterValue>
                        }).unwrap());

                        fields.named.push(Field::parse_named.parse2(quote!{
                            pub options: HashMap<String, ParameterOptions>
                        }).unwrap());

                        fields.named.push(Field::parse_named.parse2(quote!{
                            #[serde(skip)]
                            pub tables:HashMap<String, (Schema, Vec<Chunk<Arc<dyn Array>>>)>
                        }).unwrap())

                },
                _ => {
                    ()
                }
            }
            ast    
        }
        _ => panic!("`add_field` has to be used with structs "),
    };

    let name = &out_ast.ident;

    let impl_result = quote!{
        impl MaticoAnalysis for #name{
                fn get_parameter(&self, parameter_name: &str) -> Result<&::matico_analysis::ParameterValue, ::matico_analysis::ArgError> {
                    self.parameter_values
                        .get(parameter_name)
                        .ok_or(::matico_analysis::ArgError::new(parameter_name, "Does not exist"))
                }

                fn set_parameter(
                    &mut self,
                    parameter_name: &str,
                    value: ::matico_analysis::ParameterValue,
                ) -> Result<(), ::matico_analysis::ArgError> {
                    let parameter_options = self
                        .options
                        .get(parameter_name)
                        .ok_or(::matico_analysis::ArgError::new(parameter_name, "Does not exist"))?;

                    parameter_options
                        .validate_parameter(&value)
                        .map_err(|e| ::matico_analysis::ArgError::new(parameter_name, &e))?;
                    self.parameter_values.insert(parameter_name.into(), value);
                    Ok(())
                }

                fn register_table(&mut self, table_name: &str, data: &[u8]) -> Result<(), ::matico_analysis::ArgError> {
                    let mut reader = ::std::io::Cursor::new(data);
                    let metadata = ::arrow2::io::ipc::read::read_file_metadata(&mut reader)
                        .map_err(|e| ::matico_analysis::ArgError::new(table_name, &format!("Failed to load table {:#?}", e)))?;

                    let schema = metadata.schema.clone();
                    let reader = ::arrow2::io::ipc::read::FileReader::new(reader, metadata, None);

                    println!("Schema is {:#?}",schema);

                    let columns = reader
                        .collect::<::arrow2::error::Result<Vec<_>>>()
                        .map_err(|e| ::matico_analysis::ArgError::new(table_name, &format!("Failed to get columns of table {:#?}",e)))?;

                    self.tables.insert(table_name.into(), (schema, columns));
                    Ok(())
                }
        }

    };

    let interface_name = format!("{}Interface",name);

    let interface_name  = syn::Ident::new(interface_name.as_str(), proc_macro2::Span::call_site() );

    let wasm_interface= quote!{
        #[wasm_bindgen]
        pub struct #interface_name{
            analysis: #name
        }

        #[wasm_bindgen]
        impl #interface_name{
           pub fn new()->Self{
               Self{
                    analysis: #name::new()
               } 
           }

           pub fn run(&self){
           }
           
           pub fn options(&self)->JsValue{
                wasm_bindgen::JsValue::from_serde(&self.analysis.options).unwrap()
           }

           pub fn set_paramter(&mut self,name: &str, value: &JsValue)->Result<(),wasm_bindgen::JsValue>{
               let param_val: ::matico_analysis::ParameterValue = value.into_serde().unwrap();
               self.analysis.set_parameter(name,param_val)
                            .map_err(|e| wasm_bindgen::JsValue::from_serde(&e).unwrap())
           }

           pub fn get_parameter(&self, name: &str)->Result<JsValue, JsValue>{
               let val = self.analysis.get_parameter(name)
                            .map_err(|e| wasm_bindgen::JsValue::from_serde(&e).unwrap())?; 
               Ok(wasm_bindgen::JsValue::from_serde(val).unwrap())
           }

           pub fn register_table(){

           }
        }
    };


    let impl_new = quote!{
        impl #name{
            fn new()->Self{
                Self{
                    parameter_values: HashMap::new(),
                    options: Self::options(),
                    tables: HashMap::new()
                } 
            }
        }
    };

    let mut output : TokenStream = quote!{
        #[derive(Serialize,Deserialize)]
        #out_ast
    }.into();

    output.extend(TokenStream::from(impl_result));
    output.extend(TokenStream::from(impl_new));
    output.extend(TokenStream::from(wasm_interface));
    output

}
