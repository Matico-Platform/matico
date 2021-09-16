extern crate proc_macro;
extern crate syn;
#[macro_use]
extern crate quote;
use proc_macro::TokenStream;

use syn::{parse_macro_input,DeriveInput};

#[proc_macro_derive(AutoComplete)]
pub fn derive_auto_complete(input:TokenStream)->TokenStream{
    let ast = parse_macro_input!(input as DeriveInput);
   
    let name = &ast.ident;

    let result = quote!{
        impl #name{
            fn auto_complete_json(&self)->String{
                let defualt: Self = Default::default();
                serde_json::to_string(&self).unwrap() 
            }
        }
    };

    TokenStream::from(result) 
} 
