use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;

#[derive(Serialize,Deserialize,Debug)]
pub enum Control{
    Select(SelectControl),
    Range(RangeControl)
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Debug)]
pub struct SelectControl{
    categories: Vec<String>
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Debug)]
pub struct RangeControl{
    max: f32,
    min: f32,
    step: f32,
    default_value:f32
}
