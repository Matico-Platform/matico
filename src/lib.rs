use chrono::{DateTime, Utc};
use serde::{Serialize,Deserialize};
use validator::{Validate,ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Copy, Clone)]
pub struct PanePosition{
   #[validate(range(min=0,max=100))]
   pub width: usize,
   #[validate(range(min=0,max=100))]
   pub height: usize,
   pub layer: usize,
   pub float: bool
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Copy, Clone)]
pub struct LngLat{
    #[validate(range(min=-90.0,max=90.0, message="lat needs to be between -90 and 90"))]
    pub lat: f32,
    #[validate(range(min=-180.0,max=180.0, message="lng needs to be between -180 and 180"))]
    pub lng: f32
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Copy, Clone)]
pub struct MapPane{
    #[validate]
    pub position: PanePosition,
    #[validate]
    pub inital_lng_lat: LngLat 
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug, Copy,Clone)]
pub struct ChartPane{
    #[validate]
    pub position: PanePosition,
}

#[derive(Serialize,Deserialize,Debug, Copy, Clone)]
pub enum Pane{
    Map(MapPane),
    Chart(ChartPane) 
}

#[wasm_bindgen]
pub fn create_dashboard()->Dashboard{
    Dashboard{
        name:"New Dash".into(),
        created_at: chrono::Utc::now(),
        sections:vec![]
    }
}

#[wasm_bindgen]
pub fn simple_test()->String{
    "Hey there".into()
}

impl Validate for Pane{
    fn validate(&self)-> ::std::result::Result<(), ValidationErrors>{
        println!("HERE!!!!!");
        let errors = ValidationErrors::new();
        let result = if errors.is_empty(){
            Result::Ok(())
        }else{
            Result::Err(errors)
        };
        match self{
            Self::Map(map)=>{
                ValidationErrors::merge(result,"MapPane",map.validate())
            },
            Self::Chart(chart)=>{
                ValidationErrors::merge(result, "ChartPane", chart.validate())
            }
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug)]
pub struct Section{
    name: String,
    pub order: usize,
    #[validate]
    panes: Vec<Pane>
}

#[wasm_bindgen]
impl Section{
    #[wasm_bindgen(getter=panes)]
    pub fn get_panes(&self)->JsValue{
        JsValue::from_serde(&self.panes).unwrap()
    }

    #[wasm_bindgen(setter=panes)]
    pub fn set_panes(&mut self, panes: JsValue){
        let panes: Vec<Pane> = panes.into_serde().unwrap();
        self.panes = panes;
    }
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate,Debug)]
pub struct Dashboard{
    name: String,
    created_at: DateTime::<Utc>,
    #[validate]
    sections: Vec<Section>
}

#[wasm_bindgen]
#[derive(Serialize)]
pub struct ValidationResult{
    is_valid:bool,
    errors: Option<ValidationErrors> 
}


#[wasm_bindgen]
impl Dashboard{

    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self)->String{
        self.name.clone()
    }
    
    #[wasm_bindgen(setter= name)]
    pub fn set_name(&mut self, name: String){
        self.name=name;
    }

    #[wasm_bindgen(getter = created_at)]
    pub fn get_created_at(&self)->JsValue{
        JsValue::from_serde(&self.created_at).unwrap()
        // JsValue::from_serde(&self.created_at).unwrap()
    }
    
    #[wasm_bindgen(setter= created_at)]
    pub fn set_created_at(&mut self, created_at: JsValue){
        let date: chrono::DateTime<Utc> = created_at.into_serde().unwrap();
        self.created_at = date; 
    }

    pub fn from_js(val: &JsValue)->Dashboard{
        let dash : Self = val.into_serde().unwrap(); 
        dash
    }
    pub fn is_valid(&self)->JsValue{
        let error_object = match self.validate(){
            Ok(_)=> ValidationResult{ is_valid: true, errors:None}, 
            Err(errors)=> ValidationResult{ is_valid:false, errors: Some(errors)}
        };
        return JsValue::from_serde(&error_object).unwrap()
    }

    pub fn to_js(&self)->JsValue{
       JsValue::from_serde(self).unwrap() 
    }
}



#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn test_create_dashboard(){
        let dash = create_dashboard();

        assert!(true)
    }

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

    #[test]
    fn serialize(){
        let map_pane = MapPane{
            position: PanePosition{ width: 10, height:20, layer:1, float:false},
            inital_lng_lat: LngLat{ lng: 0.0, lat:0.0},
        };
        let chart_pane = ChartPane{
            position: PanePosition{ width: 20, height:30, layer:1, float:false}
        };

        let section = Section{
            name: "Test Section".into(),
            order: 1,
            panes : vec![Pane::Map(map_pane),Pane::Chart(chart_pane)]
        };

        let dash = Dashboard{
            name: "Test Dash".into(),
            created_at: chrono::Utc::now(),
            sections : vec![section]
        };
        assert!(true," succesfully generated json");
    }

    #[test]
    fn test_validation(){
        let test_str = r#"
            {
                "name": "Stuarts Dash",
                "created_at": "2021-09-10T16:11:36.462Z",
                "sections" :[
                    {
                        "name": "First screen",
                        "order": 1,
                        "panes":[
                            {"Map":{
                                "position": { "width": 20, "height":20, "layer":1, "float":false},
                                "inital_lng_lat": {"lat":0, "lng":0}
                            }
                            }
                        ]
                    }
                ]
            }
        "#; 
        let dash : Result<Dashboard,_> = serde_json::from_str(test_str);
        
        assert!(dash.is_ok(), "Failed to parse json");
        let dash = dash.unwrap();
        assert!(dash.validate().is_ok(), "Specification was invalid");
    }
}
