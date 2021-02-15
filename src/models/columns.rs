use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::Dataset;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum ColumnType {
    Numeric,
    Text,
    Boolean,
}

#[derive(Serialize, Deserialize)]
pub struct Column {
    name: String,
    col_type: ColumnType,
}
