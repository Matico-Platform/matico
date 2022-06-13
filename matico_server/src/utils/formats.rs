use derive_more::Display;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Display, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Format {
    Csv,
    Json,
    Geojson,
}

impl Format {
    pub fn mime_type(&self) -> String {
        match self {
            Self::Csv => "application/csv".into(),
            Self::Json => "application/json".into(),
            Self::Geojson => "application/geo+json".into(),
        }
    }
}

impl Default for Format {
    fn default() -> Self {
        Self::Json
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormatParam {
    pub format: Option<Format>,
    pub include_metadata: Option<bool>,
}

#[derive(PartialEq, Debug, Clone)]
pub struct MVTTile {
    pub mvt: Vec<u8>,
}
