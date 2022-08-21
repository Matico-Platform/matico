use crate::{AutoComplete, VarOr};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::Validate;

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct RangeFilter {
    variable: String,
    min: Option<VarOr<f32>>,
    max: Option<VarOr<f32>>,
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct CategoryFilter {
    variable: String,
    is_one_of: Option<Vec<String>>,
    is_not_one_of: Option<Vec<String>>,
}

#[derive(Serialize, Clone, Deserialize, Debug, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum Filter {
    NoFilter,
    Range(RangeFilter),
    Category(CategoryFilter),
}

impl Default for Filter {
    fn default() -> Self {
        Self::NoFilter
    }
}
