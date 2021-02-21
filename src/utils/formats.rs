use derive_more::Display;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Display)]
pub enum Format {
    CSV,
    JSON,
    GEOJSON,
}

#[derive(Serialize, Deserialize)]
pub struct FormatParam {
    pub format: Option<Format>,
}
