use crate::{AutoComplete, ChartPane, MapPane, HistogramPane, ScatterplotPane, PieChartPane, Control};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationError, ValidationErrors};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug, AutoCompleteMe)]
pub enum Pane {
    Map(MapPane),
    Chart(ChartPane),
    Text(TextPane),
    Histogram(HistogramPane),
    Scatterplot(ScatterplotPane),
    PieChart(PieChartPane),
    Controls(ControlsPane)
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
            Self::Text(text) => ValidationErrors::merge(result, "TextPane", text.validate()),
            Self::Histogram(histogram) => ValidationErrors::merge(result, "HistogramPane", histogram.validate()),
            Self::Scatterplot(scatter) => ValidationErrors::merge(result, "ScatterplotPane", scatter.validate()),
            Self::PieChart(piechart) => ValidationErrors::merge(result, "PieChartPane", piechart.validate()),
            Self::Controls(controls) => ValidationErrors::merge(result, "ScatterplotPane", controls.validate()),
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default)]
pub struct ControlsPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub title: String,

    #[validate]
    pub position: PanePosition,
    
    #[wasm_bindgen(skip)]
    pub controls: Vec<Control>
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default)]
pub struct TextPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[validate]
    pub position: PanePosition,

    #[wasm_bindgen(skip)]
    pub content: String,

    #[wasm_bindgen(skip)]
    pub font: Option<String>,

    #[wasm_bindgen(skip)]
    pub background: Option<String>,
}

#[wasm_bindgen]
impl TextPane {
    #[wasm_bindgen(getter = content)]
    pub fn get_content(&self) -> String {
        self.content.clone()
    }

    #[wasm_bindgen(setter = content)]
    pub fn set_content(&mut self, content: String) {
        self.content = content;
    }
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    #[wasm_bindgen(getter = font)]
    pub fn get_font(&self) -> Option<String> {
        self.font.clone()
    }

    #[wasm_bindgen(setter = font)]
    pub fn set_font(&mut self, font: String) {
        self.font = Some(font);
    }

    #[wasm_bindgen(getter = background)]
    pub fn get_background(&self) -> Option<String> {
        self.background.clone()
    }

    #[wasm_bindgen(setter = background)]
    pub fn set_background(&mut self, background: String) {
        self.background = Some(background);
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
    pub x: Option<f32>,
    pub y: Option<f32>,
}
