use derive_more::Display;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Display)]
#[serde(rename_all = "lowercase")]
pub enum Format {
    Csv,
    Json,
    Geojson,
}

impl Default for Format{
    fn default() -> Self{Self::Json}
}

#[derive(Serialize, Deserialize)]
pub struct FormatParam {
    pub format: Option<Format>,
    pub includeMetadata: Option<bool>
}


