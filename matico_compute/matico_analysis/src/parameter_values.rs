use serde::{Serialize,Deserialize};

#[derive(Serialize,Deserialize)]
pub enum ParameterValue {
    NumericFloat(f64),
    NumericInt(i64),
    NumericCategory(Vec<u32>),
    TextCategory(Vec<String>),
    Column(String),
    Table(String),
    Text(String),
}
