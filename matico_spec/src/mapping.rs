use crate::{AutoComplete, PanePosition};
use matico_spec_derive::AutoCompleteMe;
use palette::Srgb;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Debug)]
enum LayerContentType {
    Vector,
    Raster,
}

#[derive(Serialize, Deserialize, Debug)]
struct TiledLayer {
    url_template: String,
    layer_content_type: LayerContentType,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BaseMap {
    Color(Srgb),
    TiledLayer(TiledLayer),
    Image(String),
}

impl Default for BaseMap {
    fn default() -> Self {
        Self::Color(Srgb::new(0.0, 0.0, 0.0))
    }
}

#[derive(Debug, Default, Clone,Serialize, Deserialize, Validate, AutoCompleteMe)]
pub struct LayerStyle{
    
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe)]
pub struct Layer {
    name: String,
    source_name: String,
    order: usize,
    style: LayerStyle
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Copy, Clone, Default, AutoCompleteMe)]
pub struct LngLat {
    #[validate(range(min=-90.0,max=90.0, message="lat needs to be between -90 and 90"))]
    pub lat: f32,
    #[validate(range(min=-180.0,max=180.0, message="lng needs to be between -180 and 180"))]
    pub lng: f32,
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Deserialize, Validate, Debug, AutoCompleteMe)]
pub struct MapPane {
    #[validate]
    pub position: PanePosition,

    #[validate]
    pub inital_lng_lat: LngLat,

    #[wasm_bindgen(skip)]
    pub layers: Vec<Layer>,
    // pub base_map: Option<BaseMap>
}

impl Default for MapPane {
    fn default() -> Self {
        Self {
            position: PanePosition {
                width: 100,
                height: 100,
                float: false,
                layer: 1,
                x:Some(0.0),
                y:Some(0.0)
            },
            inital_lng_lat: LngLat { lng: 0.0, lat: 0.0 },
            layers: vec![], // base_map: Some(BaseMap::default())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lng_lat_validate() {
        let lng_lat = LngLat {
            lat: 0.0,
            lng: -1000.0,
        };
        let validation_result = lng_lat.validate();
        assert!(
            validation_result.is_err(),
            "lng lat validated even through lng  < 0"
        );
    }
}
