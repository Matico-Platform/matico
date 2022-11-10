use crate::{AutoComplete, Dataset, Page, Pane, Theme, ValidationResult, DatasetTransform};
use chrono::{DateTime, Utc};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
// use toml;
use validator::Validate;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Metadata {
    name: String,
    created_at: DateTime<Utc>,
    description: String,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, AutoCompleteMe, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct App {
    pages: Vec<Page>,
    panes: Vec<Pane>,
    datasets: Vec<Dataset>,
    dataset_transforms: Vec<DatasetTransform>,
    theme: Option<Theme>,
    metadata: Metadata,
}

impl Default for App {
    fn default() -> Self {
        Self {
            pages: vec![],
            panes: vec![],
            datasets: vec![],
            dataset_transforms: vec![],
            theme: None,
            metadata: Metadata {
                name: "New App".into(),
                created_at: Utc::now(),
                description: "My amazing new app".into(),
            },
        }
    }
}

#[wasm_bindgen]
impl App {
    #[wasm_bindgen(constructor)]
    pub fn new_dash() -> Self {
        Default::default()
    }

    #[wasm_bindgen(getter=pages)]
    pub fn get_pages(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.pages).unwrap()
    }

    #[wasm_bindgen(setter=pages)]
    pub fn set_pages(&mut self, pages: JsValue) {
        let pages_real = serde_wasm_bindgen::from_value(pages).unwrap();
        self.pages = pages_real;
    }

    #[wasm_bindgen(getter=panes)]
    pub fn get_panes(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.panes).unwrap()
    }

    #[wasm_bindgen(setter=panes)]
    pub fn set_panes(&mut self, panes: JsValue) {
        let panes_real = serde_wasm_bindgen::from_value(panes).unwrap();
        self.panes = panes_real;
    }

    #[wasm_bindgen(getter=theme)]
    pub fn get_theme(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.theme).unwrap()
    }

    #[wasm_bindgen(setter=theme)]
    pub fn set_theme(&mut self, pages: JsValue) {
        self.theme = serde_wasm_bindgen::from_value(pages).ok();
    }

    #[wasm_bindgen(getter=datasets)]
    pub fn get_datasets(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.datasets).unwrap()
    }

    #[wasm_bindgen(setter=datasets)]
    pub fn set_datasets(&mut self, datasets: JsValue) {
        let datasets_real = serde_wasm_bindgen::from_value(datasets).unwrap();
        self.datasets = datasets_real;
    }

    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.metadata.name.clone()
    }

    #[wasm_bindgen(setter= name)]
    pub fn set_name(&mut self, name: String) {
        self.metadata.name = name;
    }

    #[wasm_bindgen(getter = description)]
    pub fn get_description(&self) -> String {
        self.metadata.description.clone()
    }

    #[wasm_bindgen(setter= description)]
    pub fn set_description(&mut self, description: String) {
        self.metadata.description = description;
    }

    #[wasm_bindgen(getter = created_at)]
    pub fn get_created_at(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.metadata.created_at).unwrap()
        // serde_wasm_bindgen::to_value(&self.created_at).unwrap()
    }

    #[wasm_bindgen(setter= created_at)]
    pub fn set_created_at(&mut self, created_at: JsValue) {
        let date: chrono::DateTime<Utc> = serde_wasm_bindgen::from_value(created_at).unwrap();
        self.metadata.created_at = date;
    }

    pub fn from_js(val: JsValue) -> Result<App, JsValue> {
        let dash: Result<Self, _> = serde_wasm_bindgen::from_value(val);
        dash.map_err(|e| serde_wasm_bindgen::to_value(&format!("{}", e)).unwrap())
    }

    pub fn from_json(val: String) -> Result<App, JsValue> {
        let dash: Result<Self, _> = serde_json::from_str(&val);
        dash.map_err(|e| serde_wasm_bindgen::to_value(&format!("{}", e)).unwrap())
    }

    pub fn is_valid(&self) -> JsValue {
        let error_object = match self.validate() {
            Ok(_) => ValidationResult {
                is_valid: true,
                errors: None,
            },
            Err(errors) => ValidationResult {
                is_valid: false,
                errors: Some(errors),
            },
        };
        serde_wasm_bindgen::to_value(&error_object).unwrap()
    }

    pub fn to_js(&self) -> JsValue {
        serde_wasm_bindgen::to_value(self).unwrap()
    }

    pub fn to_toml(&self) -> String {
        let toml_str = toml::to_string(&self);
        let res = match toml_str {
            Ok(s) => s,
            Err(e) => format!("{}", e),
        };
        res
    }

    pub fn to_yaml(&self) -> String {
        let yaml_str = serde_yaml::to_string(&self);
        let res = match yaml_str {
            Ok(s) => s,
            Err(e) => format!("{}", e),
        };
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{MapPane, Pane, PanePosition, View};

    fn test_dash_builder() -> App {
        let map_pane: MapPane = Default::default();

        let dash: App = App {
            panes: vec![Pane::Map(map_pane)],
            ..Default::default()
        };
        dash
    }

    #[test]
    fn test_create_dashboard() {
        let dash = test_dash_builder();
        assert!(true)
    }

    #[test]
    fn test_toml_generation() {
        let dash = test_dash_builder();
        print!("{}", dash.to_toml())
    }

    #[test]
    fn serialize() {
        assert!(true, "successfully generated json");
    }

    #[test]
    fn test_autocomplete() {
        let autocomplete = App::autocomplete_json();
        println!("autocomplete result {}", autocomplete);
        assert!(true, "successfully automated")
    }
}
