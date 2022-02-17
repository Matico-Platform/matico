use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", untagged)]
pub enum ColorSpecification {
    Rgba([f32; 4]),
    Rgb([f32; 3]),
    Name(String),
}
