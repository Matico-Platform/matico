use serde::{Serialize,Deserialize};

use std::{collections::HashMap, fmt};
mod parameter_options;
mod parameter_values;
pub use parameter_options::*;
pub use parameter_values::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArgError {
    parameter_name: String,
    issue: String,
}

impl ArgError {
    pub fn new(parameter_name: &str, issue: &str) -> Self {
        ArgError {
            parameter_name: parameter_name.into(),
            issue: issue.into(),
        }
    }
}

impl fmt::Display for ArgError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "Invalid arg: {} has issue {}",
            self.parameter_name, self.issue
        )
    }
}

#[derive(Serialize,Deserialize)]
pub struct ProcessError {}

pub trait MaticoAnalysis {
    fn get_parameter(&self, param_name: &str) -> Result<&ParameterValue, ArgError>;
    fn set_parameter(&mut self, param_name: &str, value: ParameterValue) -> Result<(), ArgError>;
    fn register_table(&mut self, name: &str, data: &[u8]) -> Result<(), ArgError>;
}

pub trait MaticoAnalysisRunner{
    fn options() -> HashMap<String, ParameterOptions>;
    fn run(&mut self) -> Result<(), ProcessError>;
}
