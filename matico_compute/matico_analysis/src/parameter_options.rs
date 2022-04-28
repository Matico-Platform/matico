use enum_dispatch::enum_dispatch;
use serde::{Serialize,Deserialize};
use crate::parameter_values::ParameterValue;


struct ValidationError(String);

#[enum_dispatch]
pub trait ValidateParameter {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String>;
}


#[derive(Serialize,Deserialize)]
pub enum ColType {
    Text,
    Numeric,
    Geometry,
}

#[derive(Serialize,Deserialize)]
pub struct NumericFloatOptions {
    pub range: Option<[f32; 2]>,
    pub default: Option<i32>
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
        Self { range: None , default:None}
    }
}

#[derive(Serialize,Deserialize)]
pub struct NumericIntOptions {
    pub range: Option<[i32; 2]>,
    pub default: Option<i32>
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
        Self { range: None, default:None }
    }
}

#[derive(Serialize,Deserialize)]
pub struct NumericCategoryOptions {
    allow_multi: bool,
    options: Vec<u32>,
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
        }
    }
}

#[derive(Serialize,Deserialize)]
pub struct TextCategoryOptions {
    allow_multi: bool,
    options: Vec<String>,
}

impl Default for TextCategoryOptions {
    fn default() -> Self {
        Self {
            allow_multi: false,
            options: vec![],
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

#[derive(Serialize,Deserialize)]
pub struct ColumnOptions {
    allowed_column_types: Option<Vec<ColType>>,
}

impl Default for ColumnOptions {
    fn default() -> Self {
        Self {
            allowed_column_types: Some(vec![ColType::Text, ColType::Numeric, ColType::Geometry]),
        }
    }
}

// TODO figure out how to validate this against table
impl ValidateParameter for ColumnOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}

#[derive(Serialize,Deserialize)]
pub struct TableOptions {
    must_have_geom: bool,
}

impl Default for TableOptions {
    fn default() -> Self {
        Self {
            must_have_geom: false,
        }
    }
}

// TODO figure out how to validate this against table
impl ValidateParameter for TableOptions {
    fn validate_parameter(&self, value: &ParameterValue) -> Result<(), String> {
        Ok(())
    }
}

#[derive(Serialize,Deserialize)]
pub struct TextOptions {
    max_length: Option<usize>,
}

impl Default for TextOptions {
    fn default() -> Self {
        Self { max_length: None }
    }
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
#[derive(Serialize,Deserialize)]
pub enum ParameterOptions {
    NumericFloat(NumericFloatOptions),
    NumericInt(NumericIntOptions),
    NumericCategory(NumericCategoryOptions),
    TextCategory(TextCategoryOptions),
    Column(ColumnOptions),
    Table(TableOptions),
    Text(TextOptions),
}
