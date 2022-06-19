use crate::ColorSpecification;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Debug, Serialize, Deserialize, Clone,TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Theme {
    #[wasm_bindgen(skip)]
    pub primary_color: Option<ColorSpecification>,
    #[wasm_bindgen(skip)]
    pub secondary_color: Option<ColorSpecification>,
    #[wasm_bindgen(skip)]
    pub logo_url: Option<String>,
}

#[wasm_bindgen]
impl Theme {
    #[wasm_bindgen(getter = primaryColor)]
    pub fn get_primary_color(&self) -> JsValue {
        JsValue::from_serde(&self.primary_color).unwrap()
    }

    #[wasm_bindgen(setter = primaryColor)]
    pub fn set_primary_color(&mut self, val: JsValue) {
        self.primary_color = val.into_serde().unwrap();
    }

    #[wasm_bindgen(getter = secondaryColor)]
    pub fn get_secondary_color(&self) -> JsValue {
        JsValue::from_serde(&self.secondary_color).unwrap()
    }

    #[wasm_bindgen(setter = secondaryColor)]
    pub fn set_secondary_color(&mut self, val: JsValue) {
        self.secondary_color = val.into_serde().unwrap();
    }

    #[wasm_bindgen(getter = icon)]
    pub fn get_icon(&self) -> Option<String> {
        self.logo_url.clone()
    }

    #[wasm_bindgen(setter= icon)]
    pub fn set_icon(&mut self, logo_url: String) {
        self.logo_url = Some(logo_url);
    }
}
