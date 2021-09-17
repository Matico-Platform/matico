extern crate proc_macro;
extern crate syn;
#[macro_use]
extern crate quote;
use proc_macro::TokenStream;

use syn::{parse_macro_input,DeriveInput};

#[proc_macro_derive(AutoCompleteMe)]
pub fn derive_auto_complete(input:TokenStream)->TokenStream{
    let ast = parse_macro_input!(input as DeriveInput);
   
    let name = &ast.ident;

    let result = quote!{
        impl AutoComplete for #name{
            fn autocomplete_json()->String{
                let default: Self = Default::default();
                serde_json::to_string(&default).unwrap() 
            }
        }
    };

    TokenStream::from(result) 
} 

