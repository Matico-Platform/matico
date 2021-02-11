use crate::models::styles::*;
use diesel_as_jsonb::AsJsonb;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum BaseMap {
    CartoDBPositron,
    CartoDBVoyager,
    CartoDBDarkMatter,
    Custom(String),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum LayerSource {
    Query(Uuid),
    Dataset(Uuid),
    RawQuery(String),
    GeoJSON(String),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum LayerStyle {
    Point(PointStyle),
    Polygon(PolygonStyle),
    Line(LineStyle),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Layer {
    pub source: LayerSource,
    pub style: LayerStyle,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, AsJsonb)]
pub struct MapStyle {
    pub base_map: BaseMap,
    pub center: [f64; 2],
    pub zoom: f64,
    pub layers: Vec<Layer>,
}
