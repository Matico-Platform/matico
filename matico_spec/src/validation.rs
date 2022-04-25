use serde::Serialize;
use validator::ValidationErrors;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize)]
pub struct ValidationResult {
    pub is_valid: bool,
    #[wasm_bindgen(skip)]
    pub errors: Option<ValidationErrors>,
}

#[cfg(test)]
mod tests {
    use crate::Dashboard;
    use validator::Validate;

    #[test]
    fn test_validation() {
        let test_str = r#"
            {
                "name": "Stuarts Dash",
                "created_at": "2021-09-10T16:11:36.462Z",
                "pages":[
                ],
                "datasets":[]
            }
        "#;
        let dash: Result<Dashboard, _> = serde_json::from_str(test_str);

        assert!(dash.is_ok(), "Failed to parse json {:#?}",dash);
        let dash = dash.unwrap();
        assert!(dash.validate().is_ok(), "Specification was invalid");
    }
}
