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
   ColumnTransformStep(ColumnTransformStep)
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

// #[wasm_bindgen]
// #[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
// #[serde(rename_all = "camelCase")]
// #[ts(export)]
// pub struct Rename{
//     #[wasm_bindgen(skip)]
//     pub to: String
// }

// #[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
// #[serde(rename_all = "camelCase", tag="type")]
// #[ts(export)]
// pub enum ColumnTransform{
//     ChangeType(ChangeType),
//     Rename(Rename),
//     Drop
// }

// impl Default for ColumnTransform{
//     fn default() -> Self {
//         ColumnTransform::Drop
//     }
// }

#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub struct DateOpts{
    format: Option<String>
}

#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub struct StringOpts{
    template: Option<String>
}

#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub struct IntOpts{
    pub null_val: Option<i32>
}

#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub struct FloatOpts{
    pub null_val: Option<i32>
}
impl Default for DateOpts{
    fn default() -> Self {
       DateOpts{
          format:Some("YYYY-MM-DD".into()) 
        } 
    }
}
impl Default for StringOpts{
    fn default() -> Self {
       StringOpts{
          template:None 
        } 
    }
}

impl Default for IntOpts{
    fn default() -> Self {
        IntOpts{
            null_val:None
        }
    }
}

impl Default for FloatOpts{
    fn default() -> Self {
        FloatOpts{
            null_val:None
        }
    }
}


#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub enum ChangeType{
    Date(DateOpts),
    String(StringOpts),
    Int(IntOpts),
    Float(FloatOpts)
}

impl Default for ChangeType{
    fn default() -> Self {
        ChangeType::Int(IntOpts::default())
    }
}


#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ColumnTransform{
    #[wasm_bindgen(skip)]
    pub column: String,
    #[wasm_bindgen(skip)]
    pub to: ChangeType 
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Default, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ColumnTransformStep{
    #[wasm_bindgen(skip)]
    pub transforms: Vec<ColumnTransform>
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
    pub join_columns_right: Vec<String>,

    #[wasm_bindgen(skip)]
    pub left_prefix: String,

    #[wasm_bindgen(skip)]
    pub right_prefix: String,

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


#[derive(Serialize, Deserialize, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase", tag="type", content="value")]
#[ts(export)]
pub enum ImputeMethod{
    Value(f32),
    Mean,
    Median
}

impl Default for ImputeMethod{
    fn default()->Self{
        return ImputeMethod::Mean
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Debug, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ImputeStep{
    column: String,
    method: ImputeMethod 
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
