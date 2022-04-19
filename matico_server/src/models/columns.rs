use ts_rs::TS;
use serde::{Serialize,Deserialize};


#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct Column {
    pub name: String,
    pub col_type: String,
}

