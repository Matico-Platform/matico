use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum ColorSpecification {
    Rgba([f32; 4]),
    Rgb([f32; 3]),
    Named(String),
    Hex(String),
}
