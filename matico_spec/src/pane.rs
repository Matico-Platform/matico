use wasm_bindgen::prelude::*;
use serde::{Serialize,Deserialize};
use validator::{Validate,ValidationError, ValidationErrors};
use crate::{MapPane,ChartPane};

#[derive(Serialize,Deserialize,Debug, AutoComplete)]
pub enum Pane{
    Map(MapPane),
    Chart(ChartPane) 
}

impl Default for Pane{
    fn default()->Self{
        Self::Map(MapPane::default())
    }
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
#[derive(Serialize,Deserialize,Validate,Debug, Copy, Clone, AutoComplete,Default)]
pub struct PanePosition{
   #[validate(range(min=0,max=100))]
   pub width: usize,
   #[validate(range(min=0,max=100))]
   pub height: usize,
   pub layer: usize,
   pub float: bool
}

