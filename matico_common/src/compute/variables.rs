use crate::VarOr;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use ts_rs::TS;

use crate::{ArgError, ProcessError};

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct OptionGroupVals(Vec<OptionGroupVal>);

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct OptionGroupVal {
    pub name: String,
    pub parameter: ParameterValue,
}

impl OptionGroupVals {
    pub fn get(&self, variable: &str) -> Result<&ParameterValue, ProcessError> {
        let option_group =
            self.0
                .iter()
                .find(|v| v.name == variable)
                .ok_or_else(|| ProcessError {
                    error: format!("Failed to get {} in option group", variable).into(),
                })?;
        Ok(&option_group.parameter)
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase", tag = "type", content = "value")]
#[ts(export)]
pub enum ParameterValue {
    OptionGroup(OptionGroupVals),
    RepeatedOption(Vec<ParameterValue>),
    NumericFloat(f32),
    NumericInt(i32),
    NumericCategory(Vec<u32>),
    TextCategory(Vec<String>),
    Column(String),
    Table(String),
    Text(String),
}

impl TryFrom<&ParameterValue> for Vec<ParameterValue> {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<Vec<ParameterValue>, Self::Error> {
        if let ParameterValue::RepeatedOption(list) = parameter_value {
            return Ok(list.to_owned());
        } else {
            Err(ArgError::new(
                "",
                "Failed to convert ParameterValue to options",
            ))
        }
    }
}

impl TryFrom<&ParameterValue> for OptionGroupVals {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<OptionGroupVals, Self::Error> {
        if let ParameterValue::OptionGroup(options) = parameter_value {
            return Ok(options.to_owned());
        } else {
            Err(ArgError::new(
                "",
                "Failed to convert ParameterValue to options",
            ))
        }
    }
}

impl TryFrom<&ParameterValue> for f32 {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<f32, Self::Error> {
        if let ParameterValue::NumericFloat(val) = parameter_value {
            return Ok(*val);
        } else {
            Err(ArgError::new("", "Failed to convert ParameterValue to f64"))
        }
    }
}

impl TryFrom<&ParameterValue> for i32 {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<i32, Self::Error> {
        if let ParameterValue::NumericInt(val) = parameter_value {
            return Ok(*val);
        } else {
            Err(ArgError::new("", "Failed to convert ParameterValue to i32"))
        }
    }
}

impl TryFrom<&ParameterValue> for u32 {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<u32, Self::Error> {
        if let ParameterValue::NumericInt(val) = parameter_value {
            return Ok(*val as u32);
        } else {
            Err(ArgError::new("", "Failed to convert ParameterValue to i32"))
        }
    }
}

impl TryFrom<&ParameterValue> for Vec<u32> {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<Vec<u32>, Self::Error> {
        if let ParameterValue::NumericCategory(val) = parameter_value {
            return Ok(val.clone());
        } else {
            Err(ArgError::new(
                "",
                "Failed to convert Numeric Category ParameterValue to  u32",
            ))
        }
    }
}

impl TryFrom<&ParameterValue> for String {
    type Error = ArgError;
    fn try_from(parameter_value: &ParameterValue) -> Result<String, Self::Error> {
        match parameter_value {
            ParameterValue::Column(s) => Ok(s.clone()),
            ParameterValue::Table(s) => Ok(s.clone()),
            ParameterValue::Text(s) => Ok(s.clone()),
            _ => Err(ArgError::new("", "Failed to convert ParameterValue to i32")),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct SpecParameter {
    name: String,
    parameter: SpecParameterValue,
}

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[serde(rename_all = "camelCase", tag = "type", content = "value")]
#[ts(export)]
pub enum SpecParameterValue {
    OptionGroup(Vec<SpecParameter>),
    RepeatedOption(Vec<SpecParameterValue>),
    NumericFloat(VarOr<f32>),
    NumericInt(VarOr<i32>),
    NumericCategory(VarOr<Vec<u32>>),
    TextCategory(VarOr<Vec<String>>),
    Column(VarOr<String>),
    Table(VarOr<String>),
    Text(VarOr<String>),
}
