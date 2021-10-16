use wasm_bindgen::prelude::*;
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[wasm_bindgen]
#[derive(Default, Debug, Validate,Serialize,Deserialize, Clone)]
pub struct Page{
    name : String,
    icon : Option<String>,
    content: String,
    order: usize
}

#[wasm_bindgen]
impl Page{

    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter= name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    #[wasm_bindgen(getter = icon)]
    pub fn get_icon(&self) -> Option<String>{
        self.icon.clone()
    }

    #[wasm_bindgen(setter= icon)]
    pub fn set_icon(&mut self, icon: String) {
        self.icon = Some(icon.clone());
    }

    #[wasm_bindgen(getter = content)]
    pub fn get_content(&self) -> String {
        self.content.clone()
    }

    #[wasm_bindgen(setter= content)]
    pub fn set_content(&mut self, content: String) {
        self.content = content;
    }

}
