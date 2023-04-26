use crate::VarOr;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use ts_rs::TS;

//Todo
//- Change the types use by Parameter value to be 64 bit version
//and have conversions downcase.
//- Make macro to automatically generate To / From traits

use crate::{ArgError, ProcessError};

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export)]
pub struct OptionGroupVals(pub Vec<OptionGroupVal>);

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
    Boolean(bool),
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

impl From<f32> for ParameterValue {
    fn from(value: f32) -> Self {
        ParameterValue::NumericFloat(value)
    }
}

impl From<f64> for ParameterValue {
    fn from(value: f64) -> Self {
        ParameterValue::NumericFloat(value as f32)
    }
}

impl From<i32> for ParameterValue {
    fn from(value: i32) -> Self {
        ParameterValue::NumericInt(value)
    }
}

impl From<u32> for ParameterValue {
    fn from(value: u32) -> Self {
        ParameterValue::NumericInt(value as i32)
    }
}

impl From<bool> for ParameterValue {
    fn from(value: bool) -> Self {
        ParameterValue::Boolean(value)
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

impl TryFrom<&ParameterValue> for f64 {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<f64, Self::Error> {
        if let ParameterValue::NumericFloat(val) = parameter_value {
            return Ok(*val as f64);
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

impl TryFrom<&ParameterValue> for bool {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<bool, Self::Error> {
        if let ParameterValue::Boolean(val) = parameter_value {
            return Ok(*val);
        } else {
            Err(ArgError::new(
                "",
                "Failed to convert ParameterValue to bool",
            ))
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

impl TryFrom<&ParameterValue> for Vec<String> {
    type Error = ArgError;

    fn try_from(parameter_value: &ParameterValue) -> Result<Vec<String>, Self::Error> {
        if let ParameterValue::TextCategory(val) = parameter_value {
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
    Boolean(VarOr<bool>),
    NumericFloat(VarOr<f32>),
    NumericInt(VarOr<i32>),
    NumericCategory(VarOr<Vec<u32>>),
    TextCategory(VarOr<Vec<String>>),
    Column(VarOr<String>),
    Table(VarOr<String>),
    Text(VarOr<String>),
}
