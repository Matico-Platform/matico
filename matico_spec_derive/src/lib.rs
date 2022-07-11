extern crate proc_macro;
extern crate syn;
#[macro_use]
extern crate quote;
use proc_macro::TokenStream;

use syn::parse::Parser;
use syn::{parse_macro_input, Field};

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
pub fn matico_compute(_attr: TokenStream, input: TokenStream) -> TokenStream {
    let mut ast = parse_macro_input!(input as DeriveInput);

    // modify the struct deff to include the params we need
    let out_ast =
        match &mut ast.data {
            syn::Data::Struct(ref mut struct_data) => {
                match &mut struct_data.fields {
                    syn::Fields::Named(fields) => {
                        fields.named.push(
                            Field::parse_named
                                .parse2(quote! {
                                    pub parameter_values: HashMap<String,ParameterValue>
                                })
                                .unwrap(),
                        );

                        fields.named.push(
                            Field::parse_named
                                .parse2(quote! {
                                    pub description: Option<String>
                                })
                                .unwrap(),
                        );

                        fields.named.push(Field::parse_named.parse2(quote!{
                            pub options: ::std::collections::BTreeMap<String, ParameterOptions>
                        }).unwrap());

                        fields.named.push(
                            Field::parse_named
                                .parse2(quote! {
                                    #[serde(skip)]
                                    pub tables:HashMap<String, polars::prelude::DataFrame>
                                })
                                .unwrap(),
                        )
                    }
                    _ => (),
                }
                ast
            }
            _ => panic!("`add_field` has to be used with structs "),
        };

    let name = &out_ast.ident;

    let impl_result = quote! {
        impl MaticoAnalysis for #name{
                fn get_parameter(&self, parameter_name: &str) -> std::result::Result<&::matico_analysis::ParameterValue, ::matico_analysis::ArgError> {
                    self.parameter_values
                        .get(parameter_name)
                        .ok_or(::matico_analysis::ArgError::new(parameter_name, "Does not exist"))
                }

                fn set_parameter(
                    &mut self,
                    parameter_name: &str,
                    value: ::matico_analysis::ParameterValue,
                ) -> std::result::Result<(), ::matico_analysis::ArgError> {
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

                fn register_table(&mut self, table_name: &str, data: &[u8]) -> std::result::Result<(), ::matico_analysis::ArgError> {
                    
                    let mut reader = ::std::io::Cursor::new(data);
                    let table = polars::prelude::IpcReader::new(reader)
                        .finish()
                        .map_err(|e| 
                                 ::matico_analysis::ArgError::new(table_name,"Failed to register table. Is it an actualy dataframe?".into()))?;

                    self.tables.insert(table_name.into(),table);
                    Ok(())
                }
        }
    };

    let interface_name = format!("{}Interface", name);

    let interface_name = syn::Ident::new(interface_name.as_str(), proc_macro2::Span::call_site());

    let wasm_interface = quote! {
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

           pub fn run(&mut self)-> std::result::Result<Vec<u8>, ::wasm_bindgen::JsValue>{
               let mut result_df = self.analysis.run()
                   .map_err(|e| ::wasm_bindgen::JsValue::from_serde(&e).unwrap())?;
                    
               let mut cursor : std::io::Cursor<Vec<u8>> = std::io::Cursor::new(Vec::new());

                polars::prelude::IpcWriter::new(&mut cursor)
                          .finish(&mut result_df)
                          .map_err(|e| ::wasm_bindgen::JsValue::from( "Failed to serialize result") )?;

                cursor.set_position(0);
                Ok(cursor.into_inner())
           }

           pub fn options(&self)->::wasm_bindgen::JsValue{
                ::wasm_bindgen::JsValue::from_serde(&self.analysis.options).unwrap()
           }

           pub fn description(&self)->::wasm_bindgen::JsValue{
                ::wasm_bindgen::JsValue::from_serde(&self.analysis.description).unwrap()
           }

           pub fn set_parameter(&mut self,name: &str, value: &::wasm_bindgen::JsValue)->std::result::Result<(),::wasm_bindgen::JsValue>{
               let param_val: ::matico_analysis::ParameterValue = value.into_serde().unwrap();
               self.analysis.set_parameter(name,param_val)
                            .map_err(|e| ::wasm_bindgen::JsValue::from_serde(&e).unwrap())
           }

           pub fn get_parameter(&self, name: &str)->std::result::Result<::wasm_bindgen::JsValue, ::wasm_bindgen::JsValue>{
               let val = self.analysis.get_parameter(name)
                            .map_err(|e| ::wasm_bindgen::JsValue::from_serde(&e).unwrap())?;
               Ok(::wasm_bindgen::JsValue::from_serde(val).unwrap())
           }

           pub fn register_table(&mut self,name: &str, data: &[u8])->std::result::Result<(), ::wasm_bindgen::JsValue>{
              self.analysis.register_table(name,data)
                  .map_err(|e| ::wasm_bindgen::JsValue::from_serde(&e).unwrap())
           }
        }
    };

    let impl_new = quote! {
        impl #name{
            fn new()->Self{
                Self{
                    parameter_values: HashMap::new(),
                    options: Self::options(),
                    description: Self::description(),
                    tables: HashMap::new()
                }
            }
        }
    };

    let mut output: TokenStream = quote! {
        #[derive(Serialize,Deserialize)]
        #out_ast
    }
    .into();

    output.extend(TokenStream::from(impl_result));
    output.extend(TokenStream::from(impl_new));
    output.extend(TokenStream::from(wasm_interface));
    output
}
