use crate::{AutoComplete, PanePosition};
use serde::{Deserialize, Serialize};
use validator::Validate;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Copy, Clone, AutoCompleteMe)]
pub struct ChartPane {
    #[validate]
    pub position: PanePosition,
}
