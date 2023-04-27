use geo::Geometry;
use geo_weights::{QueensWeights, RookWeights, WeightBuilder};
use geopolars::geoseries::GeoSeries;
use matico_analysis::*;
use matico_common::{ParameterOptionDisplayDetails, ProcessError};
use polars::io::{SerReader, SerWriter};
use polars::prelude::NamedFromOwned;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[matico_spec_derive::matico_compute]
pub struct Weights {}

impl MaticoAnalysisRunner for Weights {
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {
        // Get region variables
        //

        //let include_geoms: bool = self.get_parameter("include_geoms")?.try_into()?;
        //let weight_type: Vec<String> = self.get_parameter("weight_type")?.try_into()?;
        web_sys::console::log_1(&format!("Starting").into());
        let include_geoms = true;
        let weight_type = vec![String::from("Queens")];
        let table = self
            .tables
            .get("source_dataset")
            .ok_or_else(|| ProcessError {
                error: format!("Failed to read source table {:#?}", self.tables),
            })?;
        let geomCol = table.column("geom").map_err(|e| ProcessError {
            error: "No geom column".into(),
        })?;
        web_sys::console::log_1(&format!("Got Table").into());

        // Need to find a way for compute_weights to take any object that implements
        // IntoIterator<Item=Geometry<A>>
        //
        let geoms: Vec<Geometry<f64>> = iter_geom(&geomCol).collect();

        web_sys::console::log_1(&format!("Got geom iter").into());

        let weights = match weight_type[0].as_ref() {
            "Queens" => Ok(QueensWeights::<f64>::new(10000.0).compute_weights(&geoms)),
            "Rook" => Ok(RookWeights::<f64>::new(10000.0).compute_weights(&geoms)),
            _ => Err(ProcessError {
                error: format!("Unsupported weight type {}", weight_type[0]),
            }),
        }?;

        web_sys::console::log_1(&format!("Calculated weights").into());

        let (origins, dests, weights, out_geoms) = weights
            .to_list_with_geom(&geoms)
            .map_err(|e| ProcessError { error: e })?;

        web_sys::console::log_1(&format!("Got results and geoms").into());

        let origins: Vec<u32> = origins.iter().map(|u| *u as u32).collect();
        let dests: Vec<u32> = dests.iter().map(|u| *u as u32).collect();

        web_sys::console::log_1(&format!("Got origins dests and weights").into());

        let origins: Series = Series::from_vec("origins", origins);
        let dests: Series = Series::from_vec("destinations", dests);
        let weights: Series = Series::from_vec("weights", weights);

        web_sys::console::log_1(&format!("Got origins dests and weights as series").into());
        let geom_col = Series::from_geom_vec(&out_geoms).map_err(|e| ProcessError {
            error: format!("Failed to construct geo series {:#?}", e),
        })?;

        web_sys::console::log_1(&format!("Created geom col series").into());

        let result =
            DataFrame::new(vec![origins, dests, weights, geom_col]).map_err(|e| ProcessError {
                error: format!("Failed to construct result df {}", e),
            });
        web_sys::console::log_1(&format!("Results").into());
        result
    }

    fn description() -> Option<String> {
        Some("Generate a weights matrix for the input geometry table".into())
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        options.insert(
            "weight_type".into(),
            ParameterOptions::TextCategory(TextCategoryOptions {
                default: Some("Rook".into()),
                allow_multi: false,
                options: vec!["Rook".into(), "Queens".into()],
                display_details: ParameterOptionDisplayDetails::new(
                    Some("Weight Type"),
                    Some("What kind of Adjacency matrix do you want to use"),
                ),
            }),
        );

        options.insert(
            "include_geoms".into(),
            ParameterOptions::Boolean(BooleanOption {
                default: Some(false),
                display_details: ParameterOptionDisplayDetails::new(
                    Some("Include geometries"),
                    Some("Include geometries representing the weight links in the results?"),
                ),
            }),
        );

        options.insert(
            "source_dataset".into(),
            ParameterOptions::Table(TableOptions {
                must_have_geom: true,
                display_details: ParameterOptionDisplayDetails::new(
                    Some("The table containing the geoms to calculate weights for"),
                    Some("Source Table"),
                ),
            }),
        );

        options
    }
}

#[cfg(test)]
mod tests {}
