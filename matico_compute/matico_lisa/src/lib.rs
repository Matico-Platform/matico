use geo::Geometry;
use geo_weights::{QueensWeights, RookWeights, WeightBuilder, Weights};
use geo_stats::lisa::{lisa,PermutationMethod};
use geopolars::geoseries::GeoSeries;
use matico_analysis::*;
use matico_common::{ParameterOptionDisplayDetails, ProcessError};
use polars::io::{SerReader, SerWriter};
use polars::prelude::NamedFromOwned;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;


pub struct Lisa{

}

impl MaticoAnalysisRunner for Lisa{
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {
        // Get region variables
        //

        //let include_geoms: bool = self.get_parameter("include_geoms")?.try_into()?;
        //let weight_type: Vec<String> = self.get_parameter("weight_type")?.try_into()?;
        web_sys::console::log_1(&format!("Starting").into());
        let include_geoms = true;

        let permutations: i32 = self.get_parameters("permutations")?.try_into()?;
        let variable_column: i32 = self.get_parameters("variable")?.try_into()?;

        let data_values = self
            .tables
            .get("source_dataset")
            .ok_or_else(|| ProcessError {
                error: format!("Failed to read data values table {:#?}", self.tables),
            })?;

        let weights= self
            .tables
            .get("weights_tables")
            .ok_or_else(|| ProcessError {
                error: format!("Failed to read weights table{:#?}", self.tables),
            })?;

        let weights = Weights::from_list_rep(weights.select("origins"), weights.select("destinations"), weights.select("weight"));

        let lisaResult = lisa( &weights, data_values.select(variable_column),9999, false, PermutationMethod::LOOKUP)


        let result =
            DataFrame::new(vec![origins, dests, weights, geom_col]).map_err(|e| ProcessError {
                error: format!("Failed to construct result df {}", e),
            });
        web_sys::console::log_1(&format!("Results").into());
        result
    }

    fn description() -> Option<String> {
        Some("Generate the LISA stastistic from a weights matrix and an input table".into())
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        options.insert(
            "iterations".into(),
            ParameterOptions::NumericInt(NumericIntOptions{
                default: Some(99999),
                range: Some([9,99999]),
                display_details: ParameterOptionDisplayDetails::new(
                    Some("No of permunations to calculate"),
                    Some("Number of permunations to use in simulating significance"),
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

        options.insert(
            "weights_table".into(),
            ParameterOptions::Table(TableOptions {
                must_have_geom: false,
                display_details: ParameterOptionDisplayDetails::new(
                    Some("The table containing the weights"),
                    Some("Weights Table"),
                ),
            }),
        );

        options.insert(
            "variable".into(),
            ParameterOptions::Column(ColumnOptions{
                allowed_column_types:Some(vec![ColType::Numeric]),
                from_dataset: "source_dataset",
                display_details: ParameterOptionDisplayDetails::new(
                    Some("The variable to calculate the LISA stastistic"),
                    None
                ),
            }),
        );
        options
    }
}

#[cfg(test)]
mod tests {}
