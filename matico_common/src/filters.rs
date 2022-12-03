use crate::{AutoComplete, VarOr};
use chrono::{DateTime, Utc};
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

#[derive(Serialize, Clone, Deserialize, Validate, Debug, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct DateFilter {
    variable: String,
    min: Option<DateTime<Utc>>,
    max: Option<DateTime<Utc>>,
}

impl Default for DateFilter {
    fn default() -> Self {
        Self {
            min: None,
            max: None,
            variable: "".into(),
        }
    }
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct CategoryFilter {
    variable: String,
    is_one_of: Option<Vec<String>>,
    is_not_one_of: Option<Vec<String>>,
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct RegExFilter {
    variable: String,
    regex: String,
}

#[derive(Serialize, Clone, Deserialize, Debug, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum Filter {
    NoFilter,
    Range(RangeFilter),
    Category(CategoryFilter),
    Date(DateFilter),
    RegEx(RegExFilter),
}

impl Default for Filter {
    fn default() -> Self {
        Self::NoFilter
    }
}
