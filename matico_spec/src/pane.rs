use crate::{
    AutoComplete, ChartPane, Control, HistogramPane, MapPane, PieChartPane, ScatterplotPane
};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use validator::{Validate, ValidationErrors};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug, AutoCompleteMe)]
pub enum Pane {
    Map(MapPane),
    Chart(ChartPane),
    Text(TextPane),
    Container(ContainerPane),
    Histogram(HistogramPane),
    Scatterplot(ScatterplotPane),
    PieChart(PieChartPane),
    Controls(ControlsPane),
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
            Self::Container(container) => ValidationErrors::merge(result, "ContainerPane", container.validate()),
            Self::Histogram(histogram) => {
                ValidationErrors::merge(result, "HistogramPane", histogram.validate())
            }
            Self::Scatterplot(scatter) => {
                ValidationErrors::merge(result, "ScatterplotPane", scatter.validate())
            }
            Self::PieChart(piechart) => {
                ValidationErrors::merge(result, "PieChartPane", piechart.validate())
            }
            Self::Controls(controls) => {
                ValidationErrors::merge(result, "ScatterplotPane", controls.validate())
            }
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default)]
pub struct ContainerPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[validate]
    pub position: PanePosition,

    #[wasm_bindgen(skip)]
    pub layout: String,

    #[wasm_bindgen(skip)]
    #[validate]
    pub panes: Vec<Pane>,
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
    pub controls: Vec<Control>,
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
#[derive(Serialize, Deserialize, Debug, Clone, Copy,AutoCompleteMe)]
pub enum ScreenUnits{
    Pixels,
    Percent
}

impl Default for ScreenUnits{
    fn default()->Self{
        Self::Pixels
    }    
}

impl std::fmt::Display for ScreenUnits{
 fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Self::Pixels=> write!(f, "pixels"),
            Self::Percent=> write!(f, "percent"),
        }
    } 
}

#[wasm_bindgen]
impl PanePosition{
    
    #[wasm_bindgen(getter = x_units)]
    pub fn get_x_units(&self) -> String {
        match self.x_units{
            Some(unit) => format!("{}",unit),
            None=> format!("{}",ScreenUnits::default())
        }
    }

    #[wasm_bindgen(getter = y_units)]
    pub fn get_y_units(&self) -> String {
        match self.y_units{
            Some(unit) => format!("{}",unit),
            None=> format!("{}",ScreenUnits::default())
        }
    }

    #[wasm_bindgen(getter = width_units)]
    pub fn get_width_units(&self) -> String {
        match self.width_units{
            Some(unit) => format!("{}",unit),
            None=> format!("{}",ScreenUnits::default())
        }
    }

    #[wasm_bindgen(getter = height_units)]
    pub fn get_height_units(&self) -> String {
        match self.height_units{
            Some(unit) => format!("{}",unit),
            None=> format!("{}",ScreenUnits::default())
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
    pub x: Option<f32>,
    pub y: Option<f32>,
    #[wasm_bindgen(skip)]
    pub x_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub y_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub width_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub height_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub padding: Option<[f32; 4]>,
    #[wasm_bindgen(skip)]
    pub padding_units: Option<[ScreenUnits; 4]>
}
