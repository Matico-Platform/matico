use validator::{Validate, ValidationErrors};
use wasm_bindgen::prelude::*;
use serde::{Serialize,Deserialize};

#[wasm_bindgen]
#[derive(Serialize)]
pub struct ValidationResult{
    pub is_valid:bool,
    #[wasm_bindgen(skip)]
    pub errors: Option<ValidationErrors> 
}


#[cfg(test)]
mod tests{
    use super::*;
    use crate::Dashboard;

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
                                "base_map":{
                                },
                                "position": { "width": 20, "height":20, "layer":1, "float":false},
                                "inital_lng_lat": {"lat":0, "lng":0},
                                "layers":[]
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
