use crate::{AutoComplete, DatasetRef, PanePosition, ColorSpecification, MappingVarOr};
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
    #[wasm_bindgen(skip)]
    pub name: String,
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub color: Option<MappingVar<ColorSpecification>>,
    #[wasm_bindgen(skip)]
    pub maxbins: Option<i64>,

    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>
}

#[wasm_bindgen]
impl HistogramPane {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}

#[wasm_bindgen]
#[derive(Default,Serialize,Deserialize,Validate,Debug,Clone)]
pub struct Labels{
    #[wasm_bindgen(skip)]
    pub title: Option<String>,
    #[wasm_bindgen(skip)]
    pub sub_title: Option<String>,
    #[wasm_bindgen(skip)]
    pub attribution: Option<String>, 
    #[wasm_bindgen(skip)]
    pub x_label: Option<String>, 
    #[wasm_bindgen(skip)]
    pub y_label: Option<String>, 
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe)]
pub struct ScatterplotPane {
    #[wasm_bindgen(skip)]
    pub name: String,
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub x_column: String,
    #[wasm_bindgen(skip)]
    pub y_column: String,
    #[wasm_bindgen(skip)]
    pub dot_color: Option<MappingVarOr<ColorSpecification>>,
    #[wasm_bindgen(skip)]
    pub dot_size: Option<MappingVarOr<u32>>,
    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>
}

#[wasm_bindgen]
impl ScatterplotPane {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe)]
pub struct PieChartPane {
    #[wasm_bindgen(skip)]
    pub name: String,
    #[validate]
    pub position: PanePosition,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub theme: Option<String>, // todo: add mapping for categorical but numbered values (eg. 0,1 )
    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>
}

#[wasm_bindgen]
impl PieChartPane {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}
