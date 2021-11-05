use serde::{de::DeserializeOwned, Deserialize, Serialize};
use validator::{Validate, ValidationErrors};

#[derive(Serialize, Deserialize, Debug, Clone, Validate)]
pub struct Variable {
    var: String,
    bind: Option<bool> 
}

#[derive(Serialize, Debug, Deserialize, Clone)]
#[serde(untagged)]
pub enum VarOr<T>
{
    Var(Variable),
    Value(T),
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
            Self::Value(val) => ValidationErrors::merge(result, "ChartPane", val.validate()),
        }
    }
}
