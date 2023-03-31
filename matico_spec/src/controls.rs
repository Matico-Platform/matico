use crate::{AutoComplete, DatasetRef, MappingVarOr, VarOr};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::Validate;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum Control {
    Select(SelectControl),
    Range(RangeControl),
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct SelectControl {
    name: String,
    options: VarOr<Vec<String>>,
    default_value: Option<String>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct RangeControl {
    name: String,
    max: VarOr<f32>,
    min: VarOr<f32>,
    step: VarOr<f32>,
    default_value: f32,
    change_event: Option<String>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct DateTimeSliderPane {
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub id: String,
    #[wasm_bindgen(skip)]
    pub label: Option<String>,
    #[wasm_bindgen(skip)]
    pub max: VarOr<DateTime<Utc>>,
    #[wasm_bindgen(skip)]
    pub min: VarOr<DateTime<Utc>>,
    #[wasm_bindgen(skip)]
    pub name: String,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct CategorySelectorPane {
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub id: String,
    #[wasm_bindgen(skip)]
    pub label: Option<String>,
    #[wasm_bindgen(skip)]
    pub name: String,
}
