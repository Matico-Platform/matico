use crate::{AutoComplete, ChartPane, MapPane};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Debug, AutoCompleteMe)]
pub enum Pane {
    Map(MapPane),
    Chart(ChartPane),
}

impl Default for Pane {
    fn default() -> Self {
        Self::Map(MapPane::default())
    }
}

impl Validate for Pane {
    fn validate(&self) -> ::std::result::Result<(), ValidationErrors> {
        println!("HERE!!!!!");
        let errors = ValidationErrors::new();
        let result = if errors.is_empty() {
            Result::Ok(())
        } else {
            Result::Err(errors)
        };
        match self {
            Self::Map(map) => ValidationErrors::merge(result, "MapPane", map.validate()),
            Self::Chart(chart) => ValidationErrors::merge(result, "ChartPane", chart.validate()),
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Copy, Clone, AutoCompleteMe, Default)]
pub struct PanePosition {
    #[validate(range(min = 0, max = 100))]
    pub width: usize,
    #[validate(range(min = 0, max = 100))]
    pub height: usize,
    pub layer: usize,
    pub float: bool,
}
