use crate::{
    AutoComplete,Filter, WASMCompute
};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::Validate;
use wasm_bindgen::prelude::*;


#[derive(Serialize, Deserialize,  AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum DatasetTransformStep{
   Filter(FilterStep),
   Aggregate(AggregateStep),
   Join(JoinStep),
   Compute(WASMCompute),
} 

impl Default for DatasetTransformStep{
    fn default()->Self{
        DatasetTransformStep::Filter(FilterStep{filters:vec![]})
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum JoinType{
    Inner,
    Outer,
    Left,
    Right
}

impl Default for JoinType{
    fn default()->Self{
        JoinType::Inner
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct AggregateStep{
    #[wasm_bindgen(skip)]
    pub group_by_columns: Vec<String>,
    #[wasm_bindgen(skip)]
    pub aggregate:Vec<AggregationSummary>
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct FilterStep{
    #[wasm_bindgen(skip)]
    pub filters:Vec<Filter>
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct JoinStep{
    #[wasm_bindgen(skip)]
    pub other_source_id : String,
    #[wasm_bindgen(skip)]
    pub join_type: JoinType,
    #[wasm_bindgen(skip)]
    pub join_columns_left: Vec<String>,
    #[wasm_bindgen(skip)]
    pub join_columns_right: Vec<String>
}


#[wasm_bindgen]
#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum AggregationType{
    Min,
    Max,
    Sum,
    CumulativeSum,
    Mean,
    Median,
    StandardDeviation
}

impl Default for AggregationType{
    fn default() -> Self {
        return AggregationType::Mean
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Debug, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct AggregationSummary{
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub agg_type: AggregationType,
    #[wasm_bindgen(skip)]
    pub rename: Option<String>
}


#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Debug, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct DatasetTransform{
    #[wasm_bindgen(skip)]
    pub id: String,
    #[wasm_bindgen(skip)]
    pub name:String,
    #[wasm_bindgen(skip)]
    pub description: String,
    #[wasm_bindgen(skip)]
    pub source_id: String,
    #[wasm_bindgen(skip)]
    pub steps: Vec<DatasetTransformStep>
}
