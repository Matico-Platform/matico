use crate::{AutoComplete, ColorSpecification, DatasetRef, MappingVarOr};
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::Validate;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct HistogramPane {
    #[wasm_bindgen(skip)]
    pub name: String,
    #[wasm_bindgen(skip)]
    pub id: String,

    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub color: Option<MappingVarOr<ColorSpecification>>,
    #[wasm_bindgen(skip)]
    pub maxbins: Option<i32>,

    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>,
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
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Labels {
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
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ScatterplotPane {
    #[wasm_bindgen(skip)]
    pub name: String,
    #[wasm_bindgen(skip)]
    pub id: String,
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
    pub labels: Option<Labels>,
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
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct LineChartPane {
    #[wasm_bindgen(skip)]
    pub name: String,
    #[wasm_bindgen(skip)]
    pub id: String,
    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub x_column: String,
    #[wasm_bindgen(skip)]
    pub y_column: String,
    #[wasm_bindgen(skip)]
    pub line_color: Option<MappingVarOr<ColorSpecification>>,
    #[wasm_bindgen(skip)]
    pub line_width: Option<MappingVarOr<u32>>,
    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>,
}

#[wasm_bindgen]
impl LineChartPane {
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
#[derive(Default, Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct PieChartPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub id: String,

    #[wasm_bindgen(skip)]
    pub dataset: DatasetRef,
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub theme: Option<String>, // todo: add mapping for categorical but numbered values (eg. 0,1 )
    #[wasm_bindgen(skip)]
    pub labels: Option<Labels>,
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
