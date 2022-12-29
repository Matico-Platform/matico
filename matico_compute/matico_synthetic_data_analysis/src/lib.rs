use geo::{Geometry, Point};
use geopolars::geoseries::GeoSeries;
use matico_analysis::*;
use matico_common::{ArgError, ProcessError};
use polars::io::{SerReader, SerWriter};
use polars::prelude::*;
use rand::{Rng, seq::SliceRandom};
use rand_distr::num_traits::ToPrimitive;
use rand_distr::{Binomial, Distribution, Normal, Poisson};
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[matico_spec_derive::matico_compute]
pub struct Simulation{}

impl Simulation{ 

    fn calc_objective_function(&mut self, data_frame: DataFrame){
        let bees = data_frame.column("bees");
        let bees_control = data_frame.column("bee_control"); 

        let flowers_control = data_frame.column("flowers_control");

        let trees_within_distance = data_frame.column("trees_in_distance");

        // let mean = data_frame.lazy( 
        //     select([col("bees") * lit(bees_factor)  + col("trees_within_distance") * lit(within_distance_factor)])
        // );
    }

    fn generate_random_tree_distribution(ranges:&[[f32;2];2], no_points: usize)->std::result::Result<Vec<Geometry<f64>>,ProcessError>{
        let mut rng = rand::thread_rng();

        let points: Vec<Geometry<f64>> = (0..no_points)
            .map(|_| {
                let y: f32 = rng.gen_range(ranges[1][0]..ranges[1][1]);
                let x: f32 = rng.gen_range(ranges[0][0]..ranges[0][1]);
                Geometry::Point(Point::<f64>::new(x as f64, y as f64))
            })
            .collect();
            
        Ok(points)
    }


    fn generate_grid_tree_distribution(ranges: &[[f32;2];2], no_trees: usize, no_control: usize, bee_fly_distance: f64)->std::result::Result<Vec<Geometry<f64>>,ProcessError>{

        let mut rng = rand::thread_rng();
        let x_extent = ranges[0][1]- ranges[0][1];
        let y_extent = ranges[1][1]- ranges[1][1];

        let no_not_control = no_trees - no_control/2;

        let nx : f32= (( x_extent /y_extent)*(no_not_control as f32) 
             +(x_extent-y_extent).powi(2)/(4.0*y_extent.powi(2))).sqrt()
             - (x_extent-y_extent)/(2.0*y_extent).floor();

        let nx : usize = nx.floor() as usize;

        let ny: usize = no_control/nx;

        let x_spacing : f32= (x_extent )/(nx as f32);
        let y_spacing : f32= (x_extent)/(ny as f32);

        let mut points : Vec<Geometry<f64>>= vec![];
        let mut partner_points : Vec<Geometry<f64>>= vec![];

        for i in 0..nx{
            for j in 0..ny{
                let x : f32 = ranges[0][0] + (i as f32)*x_spacing ;
                let y : f32 = ranges[1][0] + (j as f32)*y_spacing ;
                points.push(Geometry::Point(Point::<f64>::new(x as f64, y as f64)))
            }
        }

        for partner in points.choose_multiple(&mut rng,no_control/2){
            let angle: f64= rng.gen_range(0.1..2.0*std::f64::consts::PI);
            let dist  : f64= rng.gen_range(0.1..1.0)*bee_fly_distance;

            if let Geometry::Point(p) = partner{
                let x  = p.x() * angle.sin()*dist;
                let y  = p.y() * angle.cos()*dist;
                partner_points.push(
                    Geometry::Point(Point::<f64>::new(x as f64, y as f64))
                );
            }
        }
        points.extend(partner_points);
        Ok(points)
       
    }

    fn generate_tree_locations(&mut self)->std::result::Result<DataFrame, ProcessError>{
        let tree_location_type: Vec<String> = self.get_parameter("tree_location_type")?.try_into()?;

        let bee_fly_distance: f32  = self.get_parameter("bee_fly_distance")?.try_into()?;
        let outcome: OptionGroupVals = self.get_parameter("outcome")?.try_into()?;
        let no_trees: u32 = outcome.get("no_points")?.try_into()?;
        let no_proximity_control: u32 = outcome.get("no_proximity_control")?.try_into()?;


        let region: OptionGroupVals = self.get_parameter("region")?.try_into()?;
        let min_lat: f32 = region.get("min_lat")?.try_into()?;
        let max_lat: f32 = region.get("max_lat")?.try_into()?;
        let min_lng: f32 = region.get("min_lng")?.try_into()?;
        let max_lng: f32 = region.get("max_lng")?.try_into()?;
        let ranges = [[min_lng,max_lng], [min_lat, max_lat]];

        let trees: Vec<Geometry<f64>>= match tree_location_type[0].as_ref(){
             "grid"=>  Self::generate_grid_tree_distribution(&ranges, no_trees as usize, no_proximity_control as usize, bee_fly_distance as f64 ),
             "random"=> Self::generate_random_tree_distribution(&ranges, no_trees as usize),
            _ => Err(ProcessError { error:"Unsupported tree layout".into() })
          }?;

        let geo_series = Series::from_geom_vec(&trees).map_err(|e| ProcessError {
            error: format!("Failed to construct geo series {:#?}", e),
        })?;

        let df  = DataFrame::new(vec![geo_series]).unwrap();

        Ok(df) 
    }
}




impl MaticoAnalysisRunner for Simulation{
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {

        let tree_locations = self.generate_tree_locations();


        // Get region variables
        let region: OptionGroupVals = self.get_parameter("region")?.try_into()?;
        let min_lat: f32 = region.get("min_lat")?.try_into()?;
        let max_lat: f32 = region.get("max_lat")?.try_into()?;
        let min_lng: f32 = region.get("min_lng")?.try_into()?;
        let max_lng: f32 = region.get("max_lng")?.try_into()?;

        let outcome: OptionGroupVals = self.get_parameter("outcome")?.try_into()?;

        let no_points: u32 = outcome.get("no_points")?.try_into()?;
        let control_fraction: f32 = outcome.get("control_fraction")?.try_into()?;
        let intercept: f32 = outcome.get("intercept")?.try_into()?;
        let std: f32 = outcome.get("std")?.try_into()?;

        // Do some quick checks
        if max_lat <= min_lat {
            return Err(ProcessError {
                error: format!("Max lat ({}) must be > than min lat ({})", max_lat, min_lat),
            });
        }
        if max_lng <= min_lng {
            return Err(ProcessError {
                error: format!("Max lng ({}) must be > than min lng ({})", max_lng, min_lng),
            });
        }

        // Generate the random geometries
        let mut rng = rand::thread_rng();

        let points: Vec<Geometry<f64>> = (0..no_points)
            .map(|_| {
                let y: f32 = rng.gen_range(min_lat..max_lat);
                let x: f32 = rng.gen_range(min_lng..max_lng);
                Geometry::Point(Point::<f64>::new(x as f64, y as f64))
            })
            .collect();

        web_sys::console::log_1(&"Generated points".into());

        // Construct the geoseries

        let geo_series = Series::from_geom_vec(&points).map_err(|e| ProcessError {
            error: format!("Failed to construct geo series {:#?}", e),
        })?;

        // construct noise

        let mut rng = rand::thread_rng();

        let points: Vec<Geometry<f64>> = (0..no_points)
            .map(|_| {
                let y: f32 = rng.gen_range(min_lat..max_lat);
                let x: f32 = rng.gen_range(min_lng..max_lng);
                Geometry::Point(Point::<f64>::new(x as f64, y as f64))
            })
            .collect();

        // Construct the distribution

        let variables: Vec<ParameterValue> = self.get_parameter("variables")?.try_into()?;
        let mut result_series: Vec<Series> = vec![];

        // construct mean sample
        let dist = Normal::new(intercept, std).map_err(|e| ProcessError {
            error: format!("Failed to generate normal {:#?}", e),
        })?;

        let mean: Vec<f32> = (0..no_points)
            .map(|_| {
                let v: f32 = dist.sample(&mut rng);
                v
            })
            .collect();

        let mean: Series = Series::from_vec("fruit_mean", mean);
        result_series.push(mean);

        let control_variable: Vec<u32> = (0..no_points)
            .map(|_| {
                let v: bool = rng.gen_bool(control_fraction as f64);
                if v {
                    return 1;
                } else {
                    return 0;
                }
            })
            .collect();

        let control_variable: Series = Series::from_vec("control", control_variable);
        result_series.push(control_variable);

        // Construct the distributions for each variable
        for variable in variables.iter() {
            let variable_params: OptionGroupVals = variable.try_into()?;

            let variable_name: String = variable_params.get("variable_name")?.try_into()?;
            let variable_lambda: f32 = variable_params.get("variable_lambda")?.try_into()?;
            let beta: f32 = variable_params.get("beta")?.try_into()?;
            let beta_control: f32 = variable_params.get("beta_control")?.try_into()?;

            let dist = Poisson::new(variable_lambda).map_err(|e| ProcessError {
                error: format!("Failed to generate normal {:#?}", e),
            })?;

            let variable: Vec<f32> = (0..no_points)
                .map(|_| {
                    let v: f32 = dist.sample(&mut rng);
                    v
                })
                .collect();

            web_sys::console::log_1(&"Calculated distribution".into());

            let variable: Series = Series::from_vec(&variable_name, variable);
            result_series.push(variable);
        }
        result_series.push(geo_series);
        // Generate the result
        let result = DataFrame::new(result_series).map_err(|e| ProcessError {
            error: format!("Failed to construct result df {}", e),
        });

        web_sys::console::log_1(&"Created result and returnign".into());
        result
    }

    fn description() -> Option<String> {
        Some("Cluster the provided points in to clusters".into())
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        let mut region_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        region_options.insert(
            "min_lat".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Min latitude to place points in".into()),
                },
            }),
        );

        region_options.insert(
            "max_lat".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Max latitude to place points in".into()),
                },
            }),
        );
        region_options.insert(
            "min_lng".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Min longitude to place points in".into()),
                },
            }),
        );
        region_options.insert(
            "max_lng".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Max longitude to place points in".into()),
                },
            }),
        );

        let region_options = OptionGroup {
            options: region_options,
            display_details: ParameterOptionDisplayDetails {
                description: Some("Bounding box where you want your trees planted".into()),
                display_name: Some("Region".into()),
            },
        };

        let mut outcome_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        outcome_options.insert(
            "no_points".into(),
            ParameterOptions::NumericInt(NumericIntOptions {
                default: Some(20),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: Some("No of points to generate".into()),
                    display_name: Some("No points".into()),
                },
            }),
        );

        outcome_options.insert(
            "intercept".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: Some("Intercept of the observation variable".into()),
                    display_name: Some("Intercept".into()),
                },
            }),
        );

        outcome_options.insert(
            "std".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(20.),
                range: None,
                display_details: ParameterOptionDisplayDetails {
                    description: Some("Outcome std".into()),
                    display_name: Some("Error term on the outcome ".into()),
                },
            }),
        );

        outcome_options.insert(
            "tree_distribution_type".into(),
            ParameterOptions::TextCategory(TextCategoryOptions{
                options: vec!["random".into(), "grid".into()],
                allow_multi: false,
                default: Some("random".into()),
                display_details: ParameterOptionDisplayDetails {
                    description: Some("How should we arrange the trees".into()),
                    display_name: Some("Tree Distribution".into()),
                },
            }),
        );

        let outcome_options = OptionGroup {
            options: outcome_options,
            display_details: ParameterOptionDisplayDetails {
                description: Some("Details about the outcome variable".into()),
                display_name: Some("Outcome".into()),
            },
        };

        let mut variable_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        variable_options.insert(
            "variable_lambda".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(1.0),
                range: Some([0.0, 10000.0]),
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The lambda value of the poisson distribution of the variable".into(),
                    ),
                    display_name: Some("Lambda".into()),
                },
            }),
        );

        variable_options.insert(
            "beta".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(1.0),
                range: Some([0.0, 10000.0]),
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The correlation coefficent of the variable when not in the control group "
                            .into(),
                    ),
                    display_name: Some("Beta".into()),
                },
            }),
        );

        variable_options.insert(
            "beta_control".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(1.0),
                range: Some([-10000.0, 10000.0]),
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The correlation coefficent of the variable when in the control group"
                            .into(),
                    ),
                    display_name: Some("Beta control".into()),
                },
            }),
        );

        variable_options.insert(
            "variable_name".into(),
            ParameterOptions::Text(TextOptions {
                default: Some("variable".into()),
                display_details: ParameterOptionDisplayDetails {
                    description: Some("What to call the random variable".into()),
                    display_name: Some("Variable name".into()),
                },
                ..Default::default()
            }),
        );

        let variable_options = RepeatedOption {
            display_details: ParameterOptionDisplayDetails {
                description: Some("Variables to add to the resulting table".into()),
                display_name: Some("Variables".into()),
            },
            min_times: 0,
            max_times: Some(10),

            options: Box::new(ParameterOptions::OptionGroup(OptionGroup {
                display_details: ParameterOptionDisplayDetails {
                    description: Some("Details of a random variable to add to the dataset".into()),
                    display_name: Some("Variable".into()),
                },
                options: variable_options,
            })),
        };
        options.insert(
            "outcome".into(),
            ParameterOptions::OptionGroup(outcome_options),
        );
        options.insert(
            "region".into(),
            ParameterOptions::OptionGroup(region_options),
        );
        options.insert(
            "variables".into(),
            ParameterOptions::RepeatedOption(variable_options),
        );

        options
    }
}

#[cfg(test)]
mod tests {}
