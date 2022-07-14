use geo::Geometry;
use matico_analysis::*;
use polars::io::{SerWriter, SerReader};
use serde::{Deserialize, Serialize};
use std::convert::TryInto;
use std::{
    collections::{BTreeMap, HashMap},
    io::{Cursor},
};
use wasm_bindgen::prelude::*;
use polars::prelude::{Series,NamedFrom,IpcWriter};
use geopolars::{geoseries::GeoSeries, geodataframe::GeoDataFrame };

use rusty_machine::learning::dbscan::DBSCAN;
use rusty_machine::learning::UnSupModel;
use rusty_machine::linalg::Matrix;

#[matico_spec_derive::matico_compute]
pub struct HDBScanAnalysis {}

impl MaticoAnalysisRunner for HDBScanAnalysis {
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {

        let min_dist: f32  = self.get_parameter("min_dist")?.try_into()?;
        let min_clust : f32 = self.get_parameter("min_clust_no")?.try_into()?;
        let source = self.tables.get("source_dataset").unwrap();

        let geoms = source.column("geom")
            .map_err(|_| ProcessError{parameters: self.parameter_values.clone(), error:"No column geom in the input table".into()})?
            .centroid()
            .map_err(|_| ProcessError{parameters: self.parameter_values.clone(), error:"No column geom in the input table".into()})?; 

        let mut points :Vec<f64>  = Vec::with_capacity(geoms.len()*2);

        for  geom in iter_geom(&geoms){
            match geom{
                Geometry::Point(p)=>{
                    points.push(p.x());
                    points.push(p.y());
                }
                _ => unreachable!()
            }
        }

        let inputs = Matrix::new(points.len()/2, 2, points);

        let mut model = DBSCAN::new(min_dist.into(), min_clust.try_into().unwrap());

        model.train(&inputs).map_err(|e| ProcessError{
            parameters: self.parameter_values.clone(),
            error: format!("Failed to run DBSCAN {:#?}",e)
        })?;
   
        let clustering = model.clusters().ok_or_else(|| ProcessError{
            parameters: self.parameter_values.clone(),
            error: format!("extract clusters from model ")
        })?;

        let clustering: Vec<Option<u32>> = clustering.data().iter().map(|opt| opt.map(|v| v as u32)).collect();
        let clustering = Series::new("cluster_labels",clustering);

        let mut result = source.clone();

        let result = result.with_column(clustering)
                           .map_err(|_| ProcessError{parameters: self.parameter_values.clone(), error:"Failed to add column to incoming dataset".into()})?;
           
        Ok(result.to_owned())
    }

    fn description()->Option<String>{
        Some("Cluster the provided points in to clusters".into()) 
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        options.insert(
            "source_dataset".into(),
            ParameterOptions::Table(TableOptions {
                must_have_geom: true,
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The table containing the geoms and values to dot density".into(),
                    ),
                    display_name: Some("Source Table".into()),
                },
            }),
        );

        options.insert("min_dist".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(0.0001 ),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("Minimum distance between points to include in cluster".into()),
                display_name:Some("Minimum cluster dist".into())
            }
        }));

        options.insert("min_clust_no".into(), ParameterOptions::NumericInt(NumericIntOptions{
            default: Some(20),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("Minimum no of points in cluster".into()),
                display_name:Some("Min cluster no".into())
            }
        }));


        options
    }
}

#[cfg(test)]
mod tests {

}
