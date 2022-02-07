use crate::parameter_options::*;
use crate::parameter_values::*;
use arrow2::chunk::Chunk;
use arrow2::datatypes::Schema;
use std::collections::HashMap;
use std::fmt;

pub struct ProcessError {}

pub trait MaticoAnalysis {
    fn get_parameter(&self, param_name: &str) -> Result<&ParameterValue, ArgError>;
    fn set_parameter(&mut self, param_name: &str, value: ParameterValue) -> Result<(), ArgError>;
    fn options(&self) -> &HashMap<String, ParameterOptions>;
    fn run(&mut self) -> Result<(), ProcessError>;
    fn register_table(&mut self, name: &str, data: &[u8]) -> Result<(), ArgError>;
}

// trait Parameter{
//     type ParamType;
//     type OptionsType;

//     fn options(&self)->Self::OptionsType;
//     fn set_value(&self, value:Self::ParamType)->Result<(), ArgError>;
//     fn get_value(&self)->Self::ParamType;
//     fn get_name(&self)->String;
//     fn get_description(&self)->String;
//     fn is_required(&self)->bool{
//        true
//     }
// }

// pub struct NumOptions{
//    range: Option<[f64;2]>
// }

// impl Default for NumOptions{
//     fn default()->Self{
//         Self{
//             range:None
//         }
//     }
// }

// pub struct NumParam
// {
//     name: String,
//     description: String,
//     options: NumOptions,
//     value: f64
// }

// impl NumParam {
//     fn new(options: NumOptions)->Self{
//         Self{
//             name:"Numerical Param",
//             description:"Some number param",
//             options: Default::default(),
//             value: 0
//         }
//     }

//     pub fn valid(&self, num: f64)->bool{
//         if let Some(range) = self.allowed_range{
//             range[0] > num && num < range[1]
//         }
//         else{
//             true
//         }
//     }
// }

// impl Parameter for NumParam {
//     type ParamType = f64;
//     type OptionsType = NumOptions;

//     fn get_name(&self)->String{
//         self.name
//     }
//     fn get_description(&self)->String{
//         self.description
//     }
//     fn options(&self)-> Self::OptionsType{
//         return self.options
//     }
//     fn set_value(&self, value: Self::ParamType)-> Result<(),ArgError>{
//         self.value = value
//     }
//     fn get_value(&self)->Self::ParamType{
//         self.value
//     }
// }

// impl Default for NumParam{
//     fn default()->Self{
//         Self{
//             is_int: false,
//             allowed_range:None,
//             increment:None
//         }
//     }
// }

#[derive(Debug, Clone)]
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

// #[derive(Debug,Clone)]
// pub struct RunError{
//     message:String
// }

// impl fmt::Display for RunError{
//     fn fmt(&self, f:&mut fmt::Formatter)->fmt::Result{
//         write!(f,"Run failed: {}",self.message)
//     }
// }

// pub trait MaticoAnalysis{
//     fn parameters(&self)->Box<Vec<dyn Parameter>>;
//     fn set_parameter(&self, arg_name: String, value: impl Parameter)->Result<(), ArgError>;

//     fn get_parameter(&self, arg_name:String) -> Result<Box<dyn Parameter>, ArgError>;

//     // fn run()->Result<Table, RunError>;
// }
