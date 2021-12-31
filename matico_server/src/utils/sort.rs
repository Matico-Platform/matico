use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum SortDirection {
    ASSCENDING,
    DESCENDING,
}

#[derive(Serialize, Deserialize)]
pub struct SortParams {
    column: Option<String>,
    direction: Option<SortDirection>,
}
