use std::collections::BTreeMap;

use enum_dispatch::enum_dispatch;
use serde::{Serialize,Deserialize};
use crate::parameter_values::ParameterValue;
use ts_rs::TS;



#[enum_dispatch]
pub trait ValidateParameter {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String>;
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct ParameterOptionDisplayDetails{
    pub description: Option<String>,
    pub display_name: Option<String>
}

impl Default for ParameterOptionDisplayDetails{
    fn default() -> Self {
        Self{
            description:None,
            display_name:None
        }
    }
}


#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase" )]
#[ts(export)]
pub enum ColType {
    Text,
    Numeric,
    Geometry,
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct NumericFloatOptions {
    pub range: Option<[f32; 2]>,
    pub default: Option<f32>,
    pub display_details: ParameterOptionDisplayDetails
}

impl ValidateParameter for NumericFloatOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        if let ParameterValue::NumericFloat(float_val) = value {
            if let Some(allowed_range) = self.range {
                if float_val > &allowed_range[0] && float_val < &allowed_range[1] {
                    Err(format!(
                        "Value is outside of allowed range {} - {}",
                        allowed_range[0], allowed_range[1]
                    ))
                } else {
                    Ok(())
                }
            } else {
                Ok(())
            }
        } else {
            Err("Parameter type cant be validated by this option".into())
        }
    }
}

impl Default for NumericFloatOptions {
    fn default() -> Self {
        Self { range: None , default:None, display_details: Default::default()}
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct NumericIntOptions {
    pub range: Option<[i32; 2]>,
    pub default: Option<i32>,
    pub display_details: ParameterOptionDisplayDetails
}

impl ValidateParameter for NumericIntOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        if let ParameterValue::NumericInt(int_val) = value {
            if let Some(allowed_range) = self.range {
                if int_val > &allowed_range[0] && int_val < &allowed_range[1] {
                    Err(format!(
                        "Value is outside of allowed range {} - {}",
                        allowed_range[0], allowed_range[1]
                    ))
                } else {
                    Ok(())
                }
            } else {
                Ok(())
            }
        } else {
            Err("Parameter type cant be validated by this option".into())
        }
    }
}

impl Default for NumericIntOptions {
    fn default() -> Self {
        Self { range: None, default:None, display_details: Default::default()}
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct NumericCategoryOptions {
    pub allow_multi: bool,
    pub options: Vec<u32>,
    pub display_details: ParameterOptionDisplayDetails
}

impl ValidateParameter for NumericCategoryOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        if let ParameterValue::NumericCategory(categories) = value {
            if self.allow_multi && categories.len() > 1 {
                Err("Only a single category is allowed but multiple are selected".into())
            } else if categories.iter().all(|c| self.options.contains(c)) {
                Ok(())
            } else {
                Err("Some selected categories are not allowed by options".into())
            }
        } else {
            Err("Parameter type cant be validated by this option".into())
        }
    }
}

impl Default for NumericCategoryOptions {
    fn default() -> Self {
        Self {
            allow_multi: false,
            options: vec![],
            display_details: Default::default()
        }
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct TextCategoryOptions {
    pub allow_multi: bool,
    pub options: Vec<String>,
    pub display_details: ParameterOptionDisplayDetails
}

impl Default for TextCategoryOptions {
    fn default() -> Self {
        Self {
            allow_multi: false,
            options: vec![],
            display_details: Default::default()
        }
    }
}

impl ValidateParameter for TextCategoryOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        if let ParameterValue::TextCategory(categories) = value {
            if self.allow_multi && categories.len() > 1 {
                Err("Only a single category is allowed but multiple are selected".into())
            } else if categories.iter().all(|c| self.options.contains(c)) {
                Ok(())
            } else {
                Err("Some selected categories are not allowed by options".into())
            }
        } else {
            Err("Parameter type cant be validated by this option".into())
        }
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct ColumnOptions {
    pub allowed_column_types: Option<Vec<ColType>>,
    pub from_dataset: String,
    pub display_details: ParameterOptionDisplayDetails
}

impl Default for ColumnOptions {
    fn default() -> Self {
        Self {
            allowed_column_types: Some(vec![ColType::Text, ColType::Numeric, ColType::Geometry]),
            from_dataset: "".into(),
            display_details: Default::default()
        }
    }
}

// TODO figure out how to validate this against table
impl ValidateParameter for ColumnOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}


#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct TableOptions {
    pub must_have_geom: bool,
    pub display_details : ParameterOptionDisplayDetails
}

impl Default for TableOptions {
    fn default() -> Self {
        Self {
            must_have_geom: false,
            display_details: Default::default()
        }
    }
}

// TODO figure out how to validate this against table
impl ValidateParameter for TableOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct TextOptions {
    pub max_length: Option<usize>,
    pub display_details: ParameterOptionDisplayDetails,
    pub default: Option<String> 

}

impl Default for TextOptions {
    fn default() -> Self {
        Self { 
            max_length: None,
            display_details: Default::default(),
            default: None
        }
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct OptionGroup{
    pub options: BTreeMap<String,ParameterOptions>,
    pub display_details: ParameterOptionDisplayDetails,
}

// TODO implment
impl ValidateParameter for OptionGroup{
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}

// TODO implment
impl ValidateParameter for RepeatedOption{
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}

#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct RepeatedOption{
    pub options: Box<ParameterOptions>,
    pub display_details: ParameterOptionDisplayDetails,
    pub min_times: usize,
    pub max_times: Option<usize>,
}


// TODO figure out how to validate this against table
impl ValidateParameter for TextOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        if let ParameterValue::Text(str_value) = value {
            if let Some(allowed_max_length) = self.max_length {
                if str_value.len() <= allowed_max_length {
                    Ok(())
                } else {
                    Err(format!(
                        "Text parameter was larger then allowed size {}",
                        allowed_max_length
                    ))
                }
            } else {
                Ok(())
            }
        } else {
            Err("Parameter type cant be validated by this option".into())
        }
    }
}

#[enum_dispatch(ValidateParameter)]
#[derive(Serialize,Deserialize,TS)]
#[serde(rename_all="camelCase", tag="type")]
#[ts(export)]
pub enum ParameterOptions {
    OptionGroup(OptionGroup),
    RepeatedOption(RepeatedOption),
    NumericFloat(NumericFloatOptions),
    NumericInt(NumericIntOptions),
    NumericCategory(NumericCategoryOptions),
    TextCategory(TextCategoryOptions),
    Column(ColumnOptions),
    Table(TableOptions),
    Text(TextOptions),
}
