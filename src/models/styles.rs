use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct PointStyle {
    fill: String,
    size: f32,
    stroke: String,
    stroke_width: f32,
    opacity: f32,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct PolygonStyle {
    fill: String,
    size: f32,
    stroke: String,
    stroke_width: f32,
    opacity: f32,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct LineStyle {
    stroke: String,
    stroke_width: f32,
    opacity: f32,
}
