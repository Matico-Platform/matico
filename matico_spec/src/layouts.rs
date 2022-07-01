use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(tag = "type", rename_all = "camelCase")]
#[ts(export)]
pub enum Layout {
    Free,
    Linear(LinearLayout),
    Grid(GridLayout),
    Tabs(TabLayout),
}

impl Default for Layout {
    fn default() -> Self {
        Layout::Free
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum LinearLayoutDirection {
    Horizontal,
    Vertical,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct LinearLayout {
    direction: LinearLayoutDirection,
    allow_overflow: bool,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct GridLayout {
    rows: usize,
    cols: usize,
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct TabLayout {
    tab_list: Vec<String>,
}
