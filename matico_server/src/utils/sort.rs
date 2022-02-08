use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum SortDirection {
    Ascending,
    Descending,
}

impl fmt::Display for SortParams{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if let Some(col) = &self.column{
            let sort = match self.direction{
                Some( SortDirection::Ascending) => format!("ORDER BY {} ASC", col),
                Some( SortDirection::Descending) => format!("ORDER BY {} DESC", col),
                None => format!("ORDER BY {} ASC", col),
            };

            return write!(f,"{}", sort);

        }
        else{
            return write!(f, "");
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct SortParams {
    column: Option<String>,
    direction: Option<SortDirection>,
}
