use wasm_bindgen::prelude::*;
use serde::{Serialize,Deserialize};
use validator::{Validate,ValidationError, ValidationErrors};
use chrono::{DateTime, Utc};
use toml;
use crate::{Section, ValidationResult};
use matico_spec_derive::AutoComplete;

#[wasm_bindgen]
#[derive(Serialize,Deserialize,Validate, AutoComplete,Debug)]
pub struct Dashboard{
    name: String,
    created_at: DateTime::<Utc>,

    #[validate]
    sections: Vec<Section>
}



impl Default for Dashboard{
    fn default()->Self{
        Self{
            name: "New Dashboard".into(),
            created_at: Utc::now(),
            sections: vec![]
        }
    }
}

#[wasm_bindgen]
impl Dashboard{

    #[wasm_bindgen(constructor)]
    pub fn new_dash() -> Self{
        Dashboard{
            name:"New Dash".into(),
            created_at: chrono::Utc::now(),
            sections:vec![]
        }
    }

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

    pub fn from_js(val: &JsValue)->Result<Dashboard, JsValue>{
        let dash : Result<Dashboard,_>   = val.into_serde(); 
        dash.map_err(|e| JsValue::from_serde(&format!("{}",e)).unwrap())
    }
    
    pub fn from_json(val: String)->Result<Dashboard,JsValue>{
        let dash : Result<Dashboard,_>   = serde_json::from_str(&val); 
        dash.map_err(|e| JsValue::from_serde(&format!("{}",e)).unwrap())
    }

    pub fn is_valid(&self)->JsValue{
        let error_object = match self.validate(){
            Ok(_)=> ValidationResult{ is_valid: true, errors:None}, 
            Err(errors)=> ValidationResult{ is_valid:false, errors: Some(errors)}
        };
        JsValue::from_serde(&error_object).unwrap()
    }

    pub fn to_js(&self)->JsValue{
       JsValue::from_serde(self).unwrap() 
    }

    pub fn to_toml(&self)->String{
        let toml_str = toml::to_string(&self);
        let res = match toml_str{
            Ok(s)=> s,
            Err(e)=> format!("{}",e) 
        };
        res.into() 
    }
}

#[cfg(test)]
mod tests{
    use super::*;
    use crate::{PanePosition,LngLat,ChartPane,MapPane,Pane};

    fn test_dash_builder()->Dashboard{
        let map_pane: MapPane = Default::default();

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
        dash 
    }

    #[test]
    fn test_create_dashboard(){
        let dash = test_dash_builder();
        assert!(true)
    }

    #[test]
    fn test_toml_generation(){
        let dash = test_dash_builder();
        print!("{}", dash.to_toml())
    }

    #[test]
    fn serialize(){
        assert!(true," succesfully generated json");
    }
}
