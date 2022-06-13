use serde::{Serialize,Deserialize};
use matico_common::VarOr;


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

#[derive(Serialize,Deserialize,Debug, Clone)]
pub enum SpecParameterValue {
    NumericFloat(VarOr<f32>),
    NumericInt(VarOr<i32>),
    NumericCategory(VarOr<Vec<u32>>),
    TextCategory(VarOr<Vec<String>>),
    Column(VarOr<String>),
    Table(VarOr<String>),
    Text(VarOr<String>),
}
