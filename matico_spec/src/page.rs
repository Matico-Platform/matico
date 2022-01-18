use crate::Section;
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::Validate;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Debug, Validate, Serialize, Deserialize, Clone)]
pub struct Page {
    name: String,
    icon: Option<String>,
    content: Option<String>,
    #[validate]
    sections: Option<Vec<Section>>,
    pub order: usize,
    path: Option<String>,
}

#[wasm_bindgen]
impl Page {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter= name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    #[wasm_bindgen(getter = path)]
    pub fn get_path(&self) -> Option<String> {
        self.path.clone()
    }

    #[wasm_bindgen(setter= path)]
    pub fn set_path(&mut self, path: String) {
        self.path = Some(path);
    }

    #[wasm_bindgen(getter = icon)]
    pub fn get_icon(&self) -> Option<String> {
        self.icon.clone()
    }

    #[wasm_bindgen(setter= icon)]
    pub fn set_icon(&mut self, icon: String) {
        self.icon = Some(icon.clone());
    }

    #[wasm_bindgen(getter = content)]
    pub fn get_content(&self) -> Option<String> {
        self.content.clone()
    }

    #[wasm_bindgen(setter= content)]
    pub fn set_content(&mut self, content: String) {
        self.content = Some(content);
    }

    #[wasm_bindgen(getter=sections)]
    pub fn get_sections(&self) -> JsValue {
        JsValue::from_serde(&self.sections).unwrap()
    }

    #[wasm_bindgen(setter=sections)]
    pub fn set_sections(&mut self, sections: JsValue) {
        let sections_real = sections.into_serde().unwrap();
        self.sections = sections_real;
    }
}
