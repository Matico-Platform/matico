use crate::Filter;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationErrors};

#[derive(Serialize, Deserialize, Debug, Clone, Validate)]
pub struct Variable {
    var: String,
    bind: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QuantileParams {
    bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct JenksParams {
    bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EqualIntervalParams {
    pub bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum DatasetMetric {
    Min,
    Max,
    Quantile(QuantileParams),
    Jenks(JenksParams),
    EqualInterval(EqualIntervalParams),
    Mean,
    Median,
    Summary,
}

#[derive(Serialize, Deserialize, Debug, Clone, Validate)]
pub struct DatasetVal {
    pub dataset: String,
    pub column: Option<String>,
    pub metric: Option<DatasetMetric>,
    pub filters: Option<Vec<Filter>>,
    pub feature_id: Option<String>,
}

#[derive(Serialize, Debug, Deserialize, Clone)]
#[serde(untagged)]
pub enum VarOr<T> {
    Var(Variable),
    Value(T),
    DVal(DatasetVal),
}

impl<T> Validate for VarOr<T>
where
    T: Validate,
{
    fn validate(&self) -> ::std::result::Result<(), ValidationErrors> {
        let errors = ValidationErrors::new();
        let result = if errors.is_empty() {
            Result::Ok(())
        } else {
            Result::Err(errors)
        };

        match self {
            Self::Var(v) => ValidationErrors::merge(result, "Variable", v.validate()),
            Self::DVal(v) => ValidationErrors::merge(result, "", v.validate()),
            Self::Value(val) => ValidationErrors::merge(result, "Value", val.validate()),
        }
    }
}
