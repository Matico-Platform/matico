use crate::models::styles::*;
use diesel_as_jsonb::AsJsonb;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum BaseMap {
    CartoDBPositron,
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
    source: LayerSource,
    style: LayerStyle,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, AsJsonb)]
pub struct MapStyle {
    base_map: BaseMap,
    center: [f64; 2],
    zoom: f64,
    layers: Vec<Layer>,
}
