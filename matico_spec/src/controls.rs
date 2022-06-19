use crate::VarOr;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase", tag="type")]
pub enum Control {
    Select(SelectControl),
    Range(RangeControl),
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct SelectControl {
    name: String,
    options: VarOr<Vec<String>>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all="camelCase")]
pub struct RangeControl {
    name: String,
    max: VarOr<f32>,
    min: VarOr<f32>,
    step: VarOr<f32>,
    default_value: f32,
}
