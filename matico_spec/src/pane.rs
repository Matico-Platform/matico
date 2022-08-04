use crate::{AutoComplete, Control, HistogramPane, Layout, MapPane, PieChartPane, ScatterplotPane, StaticMapPane};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use validator::{Validate, ValidationErrors};
use wasm_bindgen::prelude::*;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(rename_all="camelCase")]
#[ts(export)]
pub struct PaneDetails {
    pub id: String,
    pub pane_id: String,
    pub position: PanePosition,
}

impl Default for PaneDetails{
    fn default()->Self{
        Self{
            id:Uuid::new_v4().to_string(),
            pane_id:"".into(),
            position: Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[serde(tag = "type", rename_all = "camelCase")]
#[ts(export)]
pub enum PaneRef {
    Map(PaneDetails),
    Text(PaneDetails),
    Container(PaneDetails),
    Histogram(PaneDetails),
    Scatterplot(PaneDetails),
    PieChart(PaneDetails),
    Controls(PaneDetails),
    StaticMap(PaneDetails)
}

impl PaneRef {
    pub fn id(&self) -> &str {
        match self {
            PaneRef::Map(s) => &s.id,
            PaneRef::Text(s) => &s.id,
            PaneRef::Container(s) => &s.id,
            PaneRef::Histogram(s) => &s.id,
            PaneRef::Scatterplot(s) => &s.id,
            PaneRef::PieChart(s) => &s.id,
            PaneRef::Controls(s) => &s.id,
            PaneRef::StaticMap(s) => &s.id,
        }
    }
}

impl TryFrom<(&str, &str)> for PaneRef {
    type Error = String;

    fn try_from(params: (&str, &str)) -> Result<Self, Self::Error> {
        let pane_id: String = params.1.into();
        match params.0 {
            "map" => Ok(PaneRef::Map(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "staticMap" => Ok(PaneRef::StaticMap(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "text" => Ok(PaneRef::Text(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "container" => Ok(PaneRef::Container(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "histogram" => Ok(PaneRef::Histogram(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "scatterplot" => Ok(PaneRef::Scatterplot(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "piechart" => Ok(PaneRef::PieChart(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            "controls" => Ok(PaneRef::Controls(PaneDetails {
                pane_id,
                ..Default::default()
            })),
            _ => Err("Unrecognized pane type".into()),
        }
    }
}
impl From<Pane> for PaneRef {
    fn from(pane: Pane) -> Self {
        match pane {
            Pane::Map(map) => PaneRef::Map(PaneDetails {
                pane_id: map.id,
                ..Default::default()
            }),
            Pane::StaticMap(map) => PaneRef::StaticMap(PaneDetails {
                pane_id: map.id,
                ..Default::default()
            }),
            Pane::Text(text) => PaneRef::Text(PaneDetails {
                pane_id: text.id,
                ..Default::default()
            }),
            Pane::Container(container) => PaneRef::Container(PaneDetails {
                pane_id: container.id,
                ..Default::default()
            }),
            Pane::Histogram(histogram) => PaneRef::Histogram(PaneDetails {
                pane_id: histogram.id,
                ..Default::default()
            }),
            Pane::Scatterplot(scatterplot) => PaneRef::Scatterplot(PaneDetails {
                pane_id: scatterplot.id,
                ..Default::default()
            }),
            Pane::PieChart(piechart) => PaneRef::PieChart(PaneDetails {
                pane_id: piechart.id,
                ..Default::default()
            }),
            Pane::Controls(controls) => PaneRef::Controls(PaneDetails {
                pane_id: controls.id,
                ..Default::default()
            }),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, AutoCompleteMe, TS)]
#[serde(tag = "type", rename_all = "camelCase")]
#[ts(export)]
pub enum Pane {
    Map(MapPane),
    StaticMap(StaticMapPane),
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
            Self::StaticMap(map) => ValidationErrors::merge(result, "StaticMapPane", map.validate()),
            Self::Text(text) => ValidationErrors::merge(result, "TextPane", text.validate()),
            Self::Container(container) => {
                ValidationErrors::merge(result, "ContainerPane", container.validate())
            }
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
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ContainerPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub id: String,

    #[wasm_bindgen(skip)]
    pub layout: Layout,

    #[wasm_bindgen(skip)]
    pub panes: Vec<PaneRef>,
}

impl ContainerPane {
    pub fn add_pane(&mut self, pane_type: &str, pane_id: &str) {
        let pane_ref: PaneRef = (pane_type, pane_id).try_into().unwrap();
        self.panes.push(pane_ref.into());
    }

    pub fn add_pane_before(&mut self, before_pane_id: &str, pane_type: &str, pane_id: &str) {
        let pane_ref: PaneRef = (pane_type, pane_id).try_into().unwrap();
        let before_pane_pos = self
            .panes
            .iter()
            .position(|p| p.id() == before_pane_id)
            .unwrap();
        self.panes.insert(before_pane_pos, pane_ref)
    }

    pub fn add_pane_after(&mut self, after_pane_id: &str, pane_type: &str, pane_id: &str) {
        let pane_ref: PaneRef = (pane_type, pane_id).try_into().unwrap();
        let after_pane_pos = self
            .panes
            .iter()
            .position(|p| p.id() == after_pane_id)
            .unwrap();
        self.panes.insert(after_pane_pos + 1, pane_ref)
    }

    pub fn move_pane_to_position(&mut self, pane_id: &str, new_pos: usize) {
        let pos = self.panes.iter().position(|p| p.id() == pane_id).unwrap();
        let pane = self.panes.remove(pos);
        if new_pos <= pos {
            self.panes.insert(new_pos, pane);
        } else {
            self.panes.insert(new_pos - 1, pane)
        }
    }

    pub fn add_pane_at_position(&mut self, pane_type: &str, pane_id: &str, index: usize) {
        let pane_ref: PaneRef = (pane_type, pane_id).try_into().unwrap();
        self.panes.insert(index, pane_ref);
    }

    pub fn remove_pane_at_position(&mut self, index: usize) {
        self.panes.remove(index);
    }

    pub fn remove_pane(&mut self, pane_id: &str) {
        self.panes.retain(|pane| pane.id() == pane_id);
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ControlsPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub id: String,

    #[wasm_bindgen(skip)]
    pub title: String,

    #[wasm_bindgen(skip)]
    pub controls: Vec<Control>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Clone, AutoCompleteMe, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct TextPane {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub id: String,

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
#[derive(Serialize, Deserialize, Debug, Clone, Copy, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum ScreenUnits {
    Pixels,
    Percent,
}

impl Default for ScreenUnits {
    fn default() -> Self {
        Self::Pixels
    }
}

impl std::fmt::Display for ScreenUnits {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Self::Pixels => write!(f, "pixels"),
            Self::Percent => write!(f, "percent"),
        }
    }
}

#[wasm_bindgen]
impl PanePosition {
    #[wasm_bindgen(getter = x_units)]
    pub fn get_x_units(&self) -> String {
        match self.x_units {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = y_units)]
    pub fn get_y_units(&self) -> String {
        match self.y_units {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = width_units)]
    pub fn get_width_units(&self) -> String {
        match self.width_units {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = height_units)]
    pub fn get_height_units(&self) -> String {
        match self.height_units {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = pad_units_left)]
    pub fn get_pad_units_left(&self) -> String {
        match self.pad_units_left {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = pad_units_right)]
    pub fn get_pad_units_right(&self) -> String {
        match self.pad_units_right {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = pad_units_top)]
    pub fn get_pad_units_top(&self) -> String {
        match self.pad_units_top {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }

    #[wasm_bindgen(getter = pad_units_bottom)]
    pub fn get_pad_units_bottom(&self) -> String {
        match self.pad_units_bottom {
            Some(unit) => format!("{}", unit),
            None => format!("{}", ScreenUnits::default()),
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Copy, Clone, AutoCompleteMe, Default, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct PanePosition {
    #[validate(range(min = 0, max = 100))]
    pub width: usize,
    #[validate(range(min = 0, max = 100))]
    pub height: usize,
    pub layer: usize,
    pub float: bool,
    pub x: Option<f32>,
    pub y: Option<f32>,
    pub pad_left: Option<f32>,
    pub pad_right: Option<f32>,
    pub pad_top: Option<f32>,
    pub pad_bottom: Option<f32>,
    #[wasm_bindgen(skip)]
    pub x_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub y_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub width_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub height_units: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub pad_units_left: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub pad_units_right: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub pad_units_top: Option<ScreenUnits>,
    #[wasm_bindgen(skip)]
    pub pad_units_bottom: Option<ScreenUnits>,
}
