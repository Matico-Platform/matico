use geo::{Geometry,Point};
use geopolars::geoseries::GeoSeries;
use matico_analysis::*;
use polars::io::{SerWriter, SerReader};
use polars::prelude::NamedFromOwned;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::convert::TryInto;
use std::collections::{BTreeMap, HashMap};
use wasm_bindgen::prelude::*;
use rand_distr::{Normal,Distribution};


// use polars::prelude::Series;
// use geopolars::{geoseries::GeoSeries, geodataframe::GeoDataFrame };

// use rusty_machine::learning::dbscan::DBSCAN;
// use rusty_machine::learning::UnSupModel;
// use rusty_machine::linalg::Matrix;

#[matico_spec_derive::matico_compute]
pub struct SyntheticData{}

impl MaticoAnalysisRunner for SyntheticData{
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {

        let min_lat : f32 = self.get_parameter("min_lat")?.try_into()?;

        let max_lat: f32  = self.get_parameter("max_lat")?.try_into()?;

        let min_lng: f32 = self.get_parameter("min_lng")?.try_into()?;

        let max_lng: f32 = self.get_parameter("max_lng")?.try_into()?;

        let no_points: u32 = self.get_parameter("no_points")?.try_into()?;

        let variable_name: String = self.get_parameter("variable_name")?.try_into()?;

        let mut rng = rand::thread_rng(); 
        
        let points :Vec<Geometry<f64>> = (0..no_points).map(|_| {
            let x: f32 = rng.gen_range(min_lat..max_lat);
            let y: f32 = rng.gen_range(min_lng..max_lng);
            Geometry::Point(Point::<f64>::new(x as f64, y as f64))
        }).collect();

        let geo_series = Series::from_geom_vec(&points).unwrap();
        
        let dist = Normal::new(2.0,3.0).unwrap();
        let variable : Vec<f32> = (0..no_points).map(|_| {
            let v:f32 = dist.sample(&mut rng); 
            v
        }).collect();

        let variable : Series = Series::from_vec(&variable_name, variable);

        let result = DataFrame::new(vec![variable,geo_series]).unwrap();
        Ok(result)
    }

    fn description()->Option<String>{
        Some("Cluster the provided points in to clusters".into()) 
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        options.insert("min_lat".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Min latitude to place points in".into())
            }
        }));

        options.insert("max_lat".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Max latitude to place points in".into())
            }
        }));
        options.insert("min_lng".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Min longitude to place points in".into())
            }
        }));
        options.insert("max_lng".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Max longitude to place points in".into())
            }
        }));

        options.insert("no_points".into(), ParameterOptions::NumericInt(NumericIntOptions{
            default: Some(20),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("No of points to generate".into()),
                display_name:Some("No points".into())
            }
        }));

        options.insert("variable_name".into(), ParameterOptions::Text(TextOptions{
            default: Some("variable".into()),
            display_details:ParameterOptionDisplayDetails{
                description:Some("What to call the random variable".into()),
                display_name:Some("Variable name".into())
            },
            ..Default::default()
        })); 

        options

    }
}

#[cfg(test)]
mod tests {

}
