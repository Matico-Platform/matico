use crate::{
    AutoComplete, ColorSpecification, Filter, MappingVarOr, PanePosition, ScreenUnits, VarOr,
};
use matico_spec_derive::AutoCompleteMe;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;
use validator::Validate;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum LayerContentType {
    Vector,
    Raster,
}

#[derive(Serialize, Clone, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct TiledLayer {
    url_template: String,
    layer_content_type: LayerContentType,
}

#[derive(Serialize, Clone, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct NamedBaseMap{
    name: String,
    affiliation: Option<String>
}

#[derive(Serialize, Clone, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct StyleJSONBaseMap{
    url: String,
    affiliation: Option<String>
}

#[derive(Serialize, Clone, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ImageBaseMap{
    url: String,
    affiliation: Option<String>
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase", tag="type")]
#[ts(export)]
pub enum BaseMap {
    Color(ColorSpecification),
    TiledLayer(TiledLayer),
    Image(ImageBaseMap),
    Named(NamedBaseMap),
    StyleJSON(StyleJSONBaseMap),
}

impl Default for BaseMap {
    fn default() -> Self {
        Self::Color(ColorSpecification::Rgb([0.0, 0.0, 0.0]))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum ScaleType {
    Pixels,
    Meters,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Validate, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct LayerStyle {
    size: Option<MappingVarOr<f32>>,
    fill_color: Option<MappingVarOr<ColorSpecification>>,
    opacity: Option<MappingVarOr<f32>>,
    visible: Option<bool>,
    line_color: Option<MappingVarOr<ColorSpecification>>,
    line_width: Option<MappingVarOr<f32>>,
    line_width_scale: Option<f32>,
    line_units: Option<ScaleType>,
    radius_units: Option<ScaleType>,
    radius_scale: Option<f32>,
    elevation: Option<MappingVarOr<f32>>,
    elevation_scale: Option<f32>,
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct DatasetRef {
    name: String,
    filters: Option<Vec<Filter>>,
}

#[derive(Serialize, Clone, Deserialize, Validate, Debug, Default, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Layer {
    name: String,
    id: String,
    source: DatasetRef,
    style: LayerStyle,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Validate, Debug, Copy, Clone, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct View {
    #[validate(range(min=-90.0,max=90.0, message="lat needs to be between -90 and 90"))]
    pub lat: f32,
    #[validate(range(min=-180.0,max=180.0, message="lng needs to be between -180 and 180"))]
    pub lng: f32,

    #[validate(range(min = 0.0, max = 20, message = "zoom needs to be between 0 and 20"))]
    pub zoom: f32,

    #[validate(range(
        min = 0.0,
        max = 360,
        message = "bearing needs to be between 0 and 360"
    ))]
    pub bearing: f32,

    pub pitch: f32,
}

impl Default for View {
    fn default() -> Self {
        Self {
            lat: 40.7128,
            lng: 74.0060,
            zoom: 9.0,
            bearing: 0.0,
            pitch: 0.0,
        }
    }
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Deserialize, Validate, Debug, AutoCompleteMe, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct MapPane {
    #[validate]
    pub position: PanePosition,

    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub id: String,

    #[wasm_bindgen(skip)]
    pub view: VarOr<View>,

    #[wasm_bindgen(skip)]
    pub layers: Vec<Layer>,

    #[wasm_bindgen(skip)]
    pub base_map: Option<BaseMap>,
}

#[wasm_bindgen]
impl MapPane {
    #[wasm_bindgen(getter = name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter = name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}

impl Default for MapPane {
    fn default() -> Self {
        Self {
            name: "MapPane".into(),
            id: Uuid::new_v4().to_string(),
            position: PanePosition {
                width: 100,
                height: 100,
                float: false,
                layer: 1,
                x: Some(0.0),
                y: Some(0.0),
                width_units: Some(ScreenUnits::Pixels),
                height_units: Some(ScreenUnits::Pixels),
                x_units: Some(ScreenUnits::Pixels),
                y_units: Some(ScreenUnits::Pixels),
                pad_left: Some(0.0),
                pad_right: Some(0.0),
                pad_top: Some(0.0),
                pad_bottom: Some(0.0),
                pad_units_left: Some(ScreenUnits::Pixels),
                pad_units_right: Some(ScreenUnits::Pixels),
                pad_units_top: Some(ScreenUnits::Pixels),
                pad_units_bottom: Some(ScreenUnits::Pixels),
            },
            view: VarOr::Value(View::default()),
            layers: vec![],
            base_map: Some(BaseMap::default()),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{DatasetMetric, DatasetVal, EqualIntervalParams, Mapping, Range, VarOr};

    use super::*;

    #[test]
    fn lng_lat_validate() {
        let view = View {
            lng: -181.0,
            ..Default::default()
        };
        let validation_result = view.validate();
        assert!(
            validation_result.is_err(),
            "lng lat validated even through lng  < -180"
        );
    }

    #[test]
    fn style_with_domain_from_dataset() {
        let fill_color = Some(MappingVarOr::Mapping(Mapping {
            variable: "Test".to_string(),
            domain: VarOr::DVal(DatasetVal {
                dataset: "test".to_string(),
                column: Some("test_col".to_string()),
                filters: None,
                feature_id: None,
                metric: Some(DatasetMetric::EqualInterval(EqualIntervalParams {
                    bins: 20,
                })),
            }),
            range: VarOr::Value(Range::Range(vec![
                ColorSpecification::Rgba([0.0, 0.0, 0.0, 0.0]),
                ColorSpecification::Rgba([0.0, 0.0, 0.0, 0.0]),
            ])),
        }));
        let style = LayerStyle {
            size: None,
            fill_color,
            opacity: None,
            visible: Some(true),
            line_color: None,
            line_width: None,
            line_width_scale: Some(2.0),
            line_units: Some(ScaleType::Pixels),
            radius_units: Some(ScaleType::Pixels),
            radius_scale: Some(1.0),
            elevation: None,
            elevation_scale: Some(1.0),
        };
        println!("{}", serde_json::to_string_pretty(&style).unwrap());
    }
}
