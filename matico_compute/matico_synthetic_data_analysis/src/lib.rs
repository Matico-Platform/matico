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
        
        // Get region variables
        let region: BTreeMap<String,ParameterValue> = self.get_parameter("region")?.try_into()?;
        let min_lat : f32 = region.get("min_lat").ok_or_else(|| ProcessError{error:"Failed to get min_lat".into()})?.try_into()?;
        let max_lat: f32  = region.get("max_lat").ok_or_else(|| ProcessError{error:"Failed to get max_lat".into()})?.try_into()?;
        let min_lng: f32 = region.get("min_lng").ok_or_else(|| ProcessError{error:"Failed to get min_lng".into()})?.try_into()?;
        let max_lng: f32 = region.get("max_lng").ok_or_else(|| ProcessError{error:"Failed to get max lng".into()})?.try_into()?;
        let no_points: u32 = region.get("no_points").ok_or_else(|| ProcessError{error:"Failed to get no_points".into()})?.try_into()?;

        // Get variables
        let variable: BTreeMap<String,ParameterValue> = self.get_parameter("variable")?.try_into()?;
        let variable_name: String = variable.get("variable_name").ok_or_else(|| ProcessError{error:"Failed to get variable_name".into()})?.try_into()?;
        let variable_mean: f32 = variable.get("mean").ok_or_else(|| ProcessError{error:"Failed to get variable_name".into()})?.try_into()?;
        let variable_std_dev: f32 = variable.get("std_dev").ok_or_else(|| ProcessError{error:"Failed to get variable_name".into()})?.try_into()?;

        // Do some quick checks 
        if max_lat <= min_lat {
            return Err(ProcessError{error: format!("Max lat ({}) must be > than min lat ({})",max_lat,min_lat)});
        }
        if max_lng <= min_lng{
            return Err(ProcessError{error: format!("Max lng ({}) must be > than min lng ({})",max_lng,min_lng)});
        }

        // Generate the random geometries
        let mut rng = rand::thread_rng(); 
        
        let points :Vec<Geometry<f64>> = (0..no_points).map(|_| {
            let y: f32 = rng.gen_range(min_lat..max_lat);
            let x: f32 = rng.gen_range(min_lng..max_lng);
            Geometry::Point(Point::<f64>::new(x as f64, y as f64))
        }).collect();

        web_sys::console::log_1(&"Generated points".into());

        // Construct the geoseries

        let geo_series = Series::from_geom_vec(&points).
            map_err(|e| ProcessError{
                error: format!("Failed to construct geo series {:#?}",e)
            })?;

        // Construct the distribution
        
        let dist = Normal::new(variable_mean,variable_std_dev).map_err(|e| ProcessError{
            error: format!("Failed to generate normal {:#?}",e)
        })?;

        let variable : Vec<f32> = (0..no_points).map(|_| {
            let v:f32 = dist.sample(&mut rng); 
            v
        }).collect();

        web_sys::console::log_1(&"Calculated distribution".into());

        let variable : Series = Series::from_vec(&variable_name, variable);

        // Generate the result 
        let result = DataFrame::new(vec![variable,geo_series]).map_err(|e|
            ProcessError{
                error: format!("Failed to construct result df {}", e)
            });
        web_sys::console::log_1(&"Created result and returnign".into());
        result
    }

    fn description()->Option<String>{
        Some("Cluster the provided points in to clusters".into()) 
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        
        let mut region_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        region_options.insert("min_lat".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Min latitude to place points in".into())
            }
        }));

        region_options.insert("max_lat".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Max latitude to place points in".into())
            }
        }));
        region_options.insert("min_lng".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Min longitude to place points in".into())
            }
        }));
        region_options.insert("max_lng".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(20.),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:None,
                display_name:Some("Max longitude to place points in".into())
            }
        }));

        let region_options = OptionGroup{
           options: region_options,
           display_details: ParameterOptionDisplayDetails { description: 
               Some("Bounding box where you want your trees planted".into()), display_name: Some("Region".into()) }
        }; 

    

        options.insert("no_points".into(), ParameterOptions::NumericInt(NumericIntOptions{
            default: Some(20),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("No of points to generate".into()),
                display_name:Some("No points".into())
            }
        }));

        let mut variable_options:BTreeMap<String,ParameterOptions> = BTreeMap::new();
        variable_options.insert("variable_mean".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(1.0),
            range: Some([-10000.0,10000.0]),
            display_details:ParameterOptionDisplayDetails{
                description:Some("The mean of the variable, where it is centered".into()),
                display_name:Some("Mean".into())
            }
        }));

        variable_options.insert("variable_std_dev".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(1.0),
            range: Some([0.0,10000.0]),
            display_details:ParameterOptionDisplayDetails{
                description:Some("The std_dev of the variable, where it is centered".into()),
                display_name:Some("Standard Deviation".into())
            }
        }));

        let variable_options = OptionGroup{
            display_details: ParameterOptionDisplayDetails { description: Some("Details of a random variable to add to the dataset".into()), display_name: Some("Variable".into()) },
            options : variable_options

        };

        options.insert("region".into(), ParameterOptions::OptionGroup(region_options));
        options.insert("variable".into(), ParameterOptions::OptionGroup(variable_options));


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
