use crate::{AutoComplete, PanePosition, DatasetRef};
use serde::{Deserialize, Serialize};
use validator::Validate;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Copy, Clone, AutoCompleteMe)]
pub struct ChartPane {
    #[validate]
    pub position: PanePosition,
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe)]
pub struct HistogramPane {
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub color: Option<String>,
    #[wasm_bindgen(skip)]
    pub step: Option<i64>
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe)]
pub struct ScatterplotPane {
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub x_column: String,
    #[wasm_bindgen(skip)]
    pub y_column: String,
    #[wasm_bindgen(skip)]
    pub dot_color: Option<String>,
    pub dot_size: Option<u32>
}


#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe)]
pub struct PieChartPane {
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub theme: Option<String>
    // todo: add mapping for categorical but numbered values (eg. 0,1 )
}
