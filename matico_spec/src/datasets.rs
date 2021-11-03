
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize,Deserialize,Clone,Debug)]
pub enum Dataset{
    GeoJSON(GeoJSONDataset)
}

#[wasm_bindgen]
#[derive(Default, Serialize,Deserialize,Clone,Debug)]
pub struct GeoJSONDataset{
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub url: String
}

#[wasm_bindgen]
impl GeoJSONDataset{
    #[wasm_bindgen(getter=name)]
    pub fn get_name(&self)->String{
        return self.name.clone()
    }

    #[wasm_bindgen(setter=name)]
    pub fn set_name(&mut self, name: String){
        self.name = name
    }
}