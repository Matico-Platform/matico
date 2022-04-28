use serde::{Serialize,Deserialize};

#[derive(Serialize,Deserialize,Debug, Clone)]
pub enum ParameterValue {
    NumericFloat(f32),
    NumericInt(i32),
    NumericCategory(Vec<u32>),
    TextCategory(Vec<String>),
    Column(String),
    Table(String),
    Text(String),
}
