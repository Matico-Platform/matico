use serde::{Serialize,Deserialize};
use validator::{Validate,ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;
use crate::PanePosition;


#[derive(Debug, Serialize,Deserialize)]
pub struct Layer{
    name: String
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
    pub layers: Vec<Layer>
}

#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn lng_lat_validate(){
        let lng_lat = LngLat{ lat:0.0, lng:-1000.0};
        let validation_result = lng_lat.validate();
        assert!(lng_lat.validate().is_err(), "lng lat validated even through lng  < 0");
    }

    #[test]
    fn map_validate(){
        let lng_lat = LngLat{ lat:-1000.0, lng:-1000.0};
        let map = MapPane{ inital_lng_lat: lng_lat , position: PanePosition{width:10, height:10, layer:0, float:true}};
        assert!(map.validate().is_err(), "map validated even tough lng < 0 and lat < 0");
    }


}
