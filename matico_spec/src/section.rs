use validator::{Validate,ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;
use serde::{Serialize,Deserialize};
use crate::{Pane};

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Default, AutoComplete)]
pub struct Section{
    #[wasm_bindgen(skip)]
    pub name: String,
    pub order: usize,

    #[wasm_bindgen(skip)]
    #[validate]
    pub panes: Vec<Pane>
}

#[wasm_bindgen]
impl Section{
    #[wasm_bindgen(getter=panes)]
    pub fn get_panes(&self)->JsValue{
        JsValue::from_serde(&self.panes).unwrap()
    }

    #[wasm_bindgen(setter=panes)]
    pub fn set_panes(&mut self, panes: JsValue){
        let panes: Vec<Pane> = panes.into_serde().unwrap();
        self.panes = panes;
    }
}
