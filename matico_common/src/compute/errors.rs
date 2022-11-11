use serde::{Deserialize, Serialize};
use std::fmt;

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

impl From<ArgError> for ProcessError {
    fn from(arg_err: ArgError) -> Self {
        ProcessError {
            error: format!("{:#?}", arg_err),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct ProcessError {
    pub error: String,
}
