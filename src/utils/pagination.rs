use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginationParams {
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}

impl fmt::Display for PaginationParams {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let offset = match self.offset {
            Some(o) => format!("OFFSET {}", o),
            None => format!(""),
        };

        let limit = match self.limit {
            Some(l) => format!("LIMIT {}", l),
            None => format! {""},
        };
        write!(f, "{} {}", limit, offset)
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, sqlx::FromRow)]
pub struct QueryMetadata {
    pub total: i64,
}
