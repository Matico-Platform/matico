use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct PointStyle {
    pub fill: [f32; 4],
    pub size: f32,
    pub stroke: [f32; 4],
    pub stroke_width: f32,
    pub opacity: f32,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct PolygonStyle {
    pub fill: [f32; 4],
    pub stroke: [f32; 4],
    pub stroke_width: f32,
    pub opacity: f32,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct LineStyle {
    pub stroke: [f32; 4],
    pub stroke_width: f32,
    pub opacity: f32,
}
