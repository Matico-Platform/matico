use serde::Serialize;
use ts_rs::TS;
use validator::ValidationErrors;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize,TS)]
#[ts(export)]
pub struct ValidationResult {
    pub is_valid: bool,
    #[wasm_bindgen(skip)]
    #[ts(type = "Record<String,any>")]
    pub errors: Option<ValidationErrors>,
}

#[cfg(test)]
mod tests {
    use crate::App;
    use validator::Validate;

    #[test]
    fn test_validation() {
        let test_str = r#"
            {
                "pages":[
                ],
                "panes":[],
                "datasets":[],
                "metadata":{
                    "name": "Stuarts App",
                    "createdAt": "2021-09-10T16:11:36.462Z",
                    "description": "Some app"
                }
            }
        "#;
        let app: Result<App, _> = serde_json::from_str(test_str);

        assert!(app.is_ok(), "Failed to parse json {:#?}",app);
        let app= app.unwrap();
        assert!(app.validate().is_ok(), "Specification was invalid");
    }
}
