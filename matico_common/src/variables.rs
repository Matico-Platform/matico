use crate::Filter;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::{Validate, ValidationErrors};

#[derive(Serialize, Deserialize, Debug, Clone, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Variable {
    var_id: String,
    property: Option<String>,
    bind: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct QuantileParams {
    bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct JenksParams {
    bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct EqualIntervalParams {
    pub bins: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct CategoriesParams {
    pub no_categories: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum DatasetMetric {
    Min,
    Max,
    Quantile(QuantileParams),
    Jenks(JenksParams),
    EqualInterval(EqualIntervalParams),
    Categories(CategoriesParams),
    Mean,
    Median,
    Summary,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase", untagged)]
#[ts(export)]
pub enum RangeVals<T> {
    Range(Vec<T>),
    Named(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum MappingType {
    Continuious,
    Discrete,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Range<T> {
    #[serde(rename = "type")]
    pub range_type: MappingType,
    pub values: VarOr<RangeVals<T>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(untagged)]
#[ts(export)]
pub enum DomainVal {
    String(String),
    Value(f32),
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Domain<D> {
    #[serde(rename = "type")]
    pub domain_type: MappingType,
    pub values: VarOr<Vec<D>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Mapping<D, R> {
    pub variable: String,
    pub domain: Domain<D>,
    pub range: Range<R>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(untagged, rename_all = "camelCase")]
#[ts(export)]
pub enum MappingVarOr<T> {
    Var(Variable),
    Mapping(Mapping<DomainVal, T>),
    Value(T),
}

#[derive(Serialize, Deserialize, Debug, Clone, Validate, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct DatasetVal {
    pub dataset: String,
    pub column: Option<String>,
    pub metric: Option<DatasetMetric>,
    pub filters: Option<Vec<Filter>>,
    pub feature_id: Option<String>,
}

#[derive(Serialize, Debug, Deserialize, Clone, TS)]
#[serde(untagged)]
#[ts(export)]
pub enum VarOr<T> {
    Var(Variable),
    Value(T),
    DVal(DatasetVal),
}

impl<T> VarOr<T> {
    pub fn try_val(&self) -> Result<&T, String> {
        if let VarOr::Value(v) = self {
            return Ok(v);
        } else {
            return Err(
                "VarOr has not been normalized. Normalize spec before trying this. {:#?}".into(),
            );
        }
    }
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
