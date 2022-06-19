use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize,Deserialize, Clone, Debug)]
#[serde(tag="type", rename_all="camelCase")]
pub enum Layout{
    Free,
    Linear(LinearLayout),
    Grid(GridLayout),
    Tabs(TabLayout)
}

impl Default for Layout{
    fn default()->Self{
        Layout::Free
    }
}


#[wasm_bindgen]
#[derive(Serialize,Deserialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub enum LinearLayoutDirection{
    Horizontal,
    Vertical
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct LinearLayout{
    direction: LinearLayoutDirection,
    allow_overflow: bool
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct GridLayout{
    rows: usize,
    cols: usize
}

#[derive(Serialize,Deserialize, Clone,Debug)]
#[serde(rename_all="camelCase")]
pub struct TabLayout{
    tab_list: Vec<String>
}
