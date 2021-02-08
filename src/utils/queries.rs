use diesel::prelude::*;
use diesel::sql_types::Text;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, QueryableByName, PartialEq, Debug)]
pub struct JsonQueryResult {
    #[sql_type = "Text"]
    pub res: String,
}
