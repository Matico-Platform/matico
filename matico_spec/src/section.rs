use crate::{AutoComplete, Pane};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::{Validate};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, AutoCompleteMe, Clone)]
pub struct Section {
    #[wasm_bindgen(skip)]
    pub name: String,
    pub order: usize,
    #[wasm_bindgen(skip)]
    pub layout: String,

    #[wasm_bindgen(skip)]
    #[validate]
    pub panes: Vec<Pane>,
}

impl Default for Section {
    fn default() -> Self {
        Self {
            name: "Section".into(),
            order: 1,
            layout: "free".into(),
            panes: vec![],
        }
    }
}

#[wasm_bindgen]
impl Section {
    #[wasm_bindgen(getter=panes)]
    pub fn get_panes(&self) -> JsValue {
        JsValue::from_serde(&self.panes).unwrap()
    }

    #[wasm_bindgen(setter=panes)]
    pub fn set_panes(&mut self, panes: JsValue) {
        let panes: Vec<Pane> = panes.into_serde().unwrap();
        self.panes = panes;
    }

    #[wasm_bindgen(getter=layout)]
    pub fn get_layout(&self) -> String {
        self.layout.clone()
    }

    #[wasm_bindgen(setter=layout)]
    pub fn set_layout(&mut self, layout: String) {
        self.layout = layout;
    }
}
