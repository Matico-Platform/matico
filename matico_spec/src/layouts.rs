use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(tag = "type", rename_all = "camelCase")]
#[ts(export)]
pub enum Layout {
    Free(FreeLayout),
    Linear(LinearLayout),
    Grid(GridLayout),
    Tabs(TabLayout),
}

impl Default for Layout {
    fn default() -> Self {
        Layout::Free(FreeLayout{allow_overflow:false})
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS, Copy)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum LinearLayoutDirection {
    Row,
    Column,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS, Copy)]
#[ts(export)]
pub enum Justification{
    #[serde(rename="flex-start")]
    FlexStart,
    #[serde(rename="flex-end")]
    FlexEnd,
    #[serde(rename="center")]
    Center,
    #[serde(rename="space-between")]
    SpaceBetween,
    #[serde(rename="space-around")]
    SpaceAround,
    #[serde(rename="space-evenly")]
    SpaceEvenly
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS, Copy)]
#[ts(export)]
pub enum Alignment{
    #[serde(rename="flex-start")]
    FlexStart,
    #[serde(rename="flex-end")]
    FlexEnd,
    #[serde(rename="center")]
    Center,
    #[serde(rename="stretch")]
    Stretch,
    #[serde(rename="baseline")]
    BaseLine,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct LinearLayout {
    pub direction: LinearLayoutDirection,
    pub allow_overflow: bool,
    pub justify: Justification,
    pub align: Alignment
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct FreeLayout{
    pub allow_overflow: bool,
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
