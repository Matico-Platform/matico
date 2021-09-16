use serde::{Serialize,Deserialize};
use validator::{Validate,ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;
use crate::PanePosition;
use palette::Srgb;


#[derive(Serialize,Deserialize,Debug)]
enum LayerContentType{
    Vector,
    Raster
}

#[derive(Serialize,Deserialize,Debug)]
struct TiledLayer{
    urlTemplate: String,
    LayerContentType: LayerContentType
}


pub enum BaseMap{
    Color(Srgb),
    TiledLayer(TiledLayer),
    Image(String)
}

#[derive(Serialize,Deserialize,Validate,Debug)]
pub struct Layer{
    name: String,
    source_name: String,
    order: usize,
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug,Copy,Clone)]
pub struct LngLat{
    #[validate(range(min=-90.0,max=90.0, message="lat needs to be between -90 and 90"))]
    pub lat: f32,
    #[validate(range(min=-180.0,max=180.0, message="lng needs to be between -180 and 180"))]
    pub lng: f32
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug)]
pub struct MapPane{
    #[validate]
    pub position: PanePosition,

    #[validate]
    pub inital_lng_lat: LngLat,

    #[wasm_bindgen(skip)]
    pub layers: Vec<Layer>
}

impl Default for MapPane{
    fn default() ->Self{
        Self{
            position: PanePosition{
                width:100,
                height:100,
                float:false,
                layer:1
            },
            inital_lng_lat:LngLat{lng:0.0, lat:0.0},
            layers:vec![]
        }
    }
}

#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn lng_lat_validate(){
        let lng_lat = LngLat{ lat:0.0, lng:-1000.0};
        let validation_result = lng_lat.validate();
        assert!(validation_result.is_err(), "lng lat validated even through lng  < 0");
    }


}
