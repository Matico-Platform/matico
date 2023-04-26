mod simulation;

use matico_analysis::*;
use matico_common::ProcessError;
use polars::io::{SerReader, SerWriter};
use polars::prelude::*;
use serde::{Deserialize, Serialize};
use simulation::{Experiment, Group, Layout, Simulation};
use std::collections::{BTreeMap, HashMap};
use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[matico_spec_derive::matico_compute]
pub struct BeesSimulation {}

impl BeesSimulation {}

const EXPERIMENTS: [Experiment; 5] = [
    Experiment::NoFruits,
    Experiment::NoBees,
    Experiment::Wind,
    Experiment::Soil,
    Experiment::Proximity,
];

impl MaticoAnalysisRunner for BeesSimulation {
    fn run(&mut self) -> std::result::Result<DataFrame, ProcessError> {
        let bees_mean: u32 = self.get_parameter("bees_mean")?.try_into()?;
        let fruit_mean: u32 = self.get_parameter("fruits_mean")?.try_into()?;
        let cluster_radius: f64 = self.get_parameter("cluster_radius")?.try_into()?;

        let groups: Vec<ParameterValue> = self.get_parameter("groups")?.try_into()?;

        let sim_groups = groups
            .iter()
            .map(|g| {
                let group_params: OptionGroupVals = g.try_into()?;

                let region: OptionGroupVals = group_params.get("region")?.try_into()?;
                let min_lat: f64 = region.get("min_lat")?.try_into()?;
                let max_lat: f64 = region.get("max_lat")?.try_into()?;
                let min_lng: f64 = region.get("min_lng")?.try_into()?;
                let max_lng: f64 = region.get("max_lng")?.try_into()?;

                // Do some quick checks
                if max_lat <= min_lat {
                    return Err(ProcessError {
                        error: format!(
                            "Max lat ({}) must be > than min lat ({})",
                            max_lat, min_lat
                        ),
                    });
                }
                if max_lng <= min_lng {
                    return Err(ProcessError {
                        error: format!(
                            "Max lng ({}) must be > than min lng ({})",
                            max_lng, min_lng
                        ),
                    });
                }

                let no_observations: u32 = group_params.get("no_observations")?.try_into()?;
                let name: String = group_params.get("name")?.try_into()?;

                let layout_val: Vec<String> = group_params.get("layout")?.try_into()?;
                let layout_val = layout_val[0].clone();

                let layout: Layout = match layout_val.as_str() {
                    "random" => Ok(Layout::Random),
                    "gridded" => Ok(Layout::Gridded),
                    "clustered" => Ok(Layout::Clustered),
                    _ => Err(ProcessError {
                        error: format!("Layout if not of known type"),
                    }),
                }?;

                let experiment_options: OptionGroupVals =
                    group_params.get("experiments")?.try_into()?;

                let mut experiments: Vec<Experiment> = vec![];

                for experiment in EXPERIMENTS {
                    let is_active: bool = experiment_options
                        .get(&format!("{}_control", experiment))?
                        .try_into()?;

                    if is_active {
                        experiments.push(Experiment::NoBees);
                    }
                }

                Ok(Group::new(
                    &name,
                    [min_lat, min_lng, max_lat, max_lng],
                    no_observations,
                    experiments,
                    layout,
                ))
            })
            .collect::<std::result::Result<Vec<Group>, ProcessError>>()?;

        let sim = Simulation::new(sim_groups, bees_mean, fruit_mean, cluster_radius);
        let results = sim.run();

        #[cfg(target_arch = "wasm32")]
        unsafe {
            web_sys::console::log_1(&"Created result and returnign".into());
        }

        Ok(results)
    }

    fn description() -> Option<String> {
        Some("Cluster the provided points in to clusters".into())
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        let mut group_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        let mut region_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        region_options.insert(
            "min_lat".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                default: Some(32.416),
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
                default: Some(32.42),
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
                default: Some(-85.707),
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
                default: Some(-85.701),
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

        let mut experiment_options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        for control in EXPERIMENTS {
            experiment_options.insert(
                format!("{}_control", control),
                ParameterOptions::Boolean(BooleanOption {
                    default: Some(false),
                    display_details: ParameterOptionDisplayDetails {
                        description: None,
                        display_name: Some(format!("{} control", control)),
                    },
                }),
            );
        }

        let experiment_options = OptionGroup {
            options: experiment_options,
            display_details: ParameterOptionDisplayDetails {
                display_name: Some("Experiments".into()),
                description: None,
            },
        };

        group_options.insert(
            "layout".into(),
            ParameterOptions::TextCategory(TextCategoryOptions {
                allow_multi: false,
                options: vec!["gridded".into(), "clustered".into(), "random".into()],
                default: Some(vec!["random".into()]),
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Layout".into()),
                },
            }),
        );

        group_options.insert(
            "region".into(),
            ParameterOptions::OptionGroup(region_options),
        );

        group_options.insert(
            "name".into(),
            ParameterOptions::Text(TextOptions {
                max_length: None,
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("name".into()),
                },
                default: Some("Control".into()),
            }),
        );

        group_options.insert(
            "experiments".into(),
            ParameterOptions::OptionGroup(experiment_options),
        );

        group_options.insert(
            "no_observations".into(),
            ParameterOptions::NumericInt(NumericIntOptions {
                range: Some([0, 1000]),
                default: Some(10),
                display_details: ParameterOptionDisplayDetails {
                    display_name: Some("No Observations".into()),
                    description: Some("Number if observations in this group".into()),
                },
            }),
        );

        let group_options = OptionGroup {
            options: group_options,
            display_details: ParameterOptionDisplayDetails {
                description: None,
                display_name: None,
            },
        };

        options.insert(
            "bees_mean".into(),
            ParameterOptions::NumericInt(NumericIntOptions {
                range: Some([0, 100]),
                default: Some(10),
                display_details: ParameterOptionDisplayDetails {
                    display_name: Some("Bees mean".into()),
                    description: None,
                },
            }),
        );

        options.insert(
            "fruits_mean".into(),
            ParameterOptions::NumericInt(NumericIntOptions {
                range: Some([0, 100]),
                default: Some(10),
                display_details: ParameterOptionDisplayDetails {
                    display_name: Some("Fruits mean".into()),
                    description: None,
                },
            }),
        );

        options.insert(
            "cluster_radius".into(),
            ParameterOptions::NumericFloat(NumericFloatOptions {
                range: Some([0.0, 0.01]),
                default: Some(0.003),
                display_details: ParameterOptionDisplayDetails {
                    display_name: Some("Cluster radius".into()),
                    description: None,
                },
            }),
        );

        options.insert(
            "groups".into(),
            ParameterOptions::RepeatedOption(RepeatedOption {
                options: Box::new(ParameterOptions::OptionGroup(group_options)),
                display_details: ParameterOptionDisplayDetails {
                    description: None,
                    display_name: Some("Groups".into()),
                },
                min_times: 1,
                max_times: Some(10),
            }),
        );

        options
    }
}

#[cfg(test)]
mod tests {
    use crate::BeesSimulation;
    use matico_analysis::*;
    use polars::prelude::*;

    fn experiment_group(
        name: &str,
        region: [f64; 4],
        no_observations: u32,
        bees: bool,
        fruits: bool,
        wind: bool,
        soil: bool,
        proximity: bool,
        layout: &str,
    ) -> OptionGroupVals {
        let region = OptionGroupVals(vec![
            OptionGroupVal {
                name: "min_lat".into(),
                parameter: region[0].into(),
            },
            OptionGroupVal {
                name: "min_lng".into(),
                parameter: region[1].into(),
            },
            OptionGroupVal {
                name: "max_lat".into(),
                parameter: region[2].into(),
            },
            OptionGroupVal {
                name: "max_lng".into(),
                parameter: region[3].into(),
            },
        ]);

        let experiments = OptionGroupVals(vec![
            OptionGroupVal {
                name: "bees_control".into(),
                parameter: bees.into(),
            },
            OptionGroupVal {
                name: "fruits_control".into(),
                parameter: fruits.into(),
            },
            OptionGroupVal {
                name: "wind_control".into(),
                parameter: wind.into(),
            },
            OptionGroupVal {
                name: "soil_control".into(),
                parameter: soil.into(),
            },
            OptionGroupVal {
                name: "proximity_control".into(),
                parameter: proximity.into(),
            },
        ]);

        let group = OptionGroupVals(vec![
            OptionGroupVal {
                name: "region".into(),
                parameter: ParameterValue::OptionGroup(region),
            },
            OptionGroupVal {
                name: "experiments".into(),
                parameter: ParameterValue::OptionGroup(experiments),
            },
            OptionGroupVal {
                name: "no_observations".into(),
                parameter: no_observations.into(),
            },
            OptionGroupVal {
                name: "name".into(),
                parameter: ParameterValue::Text(String::from(name)),
            },
            OptionGroupVal {
                name: "layout".into(),
                parameter: ParameterValue::TextCategory(vec![layout.into()]),
            },
        ]);
        group
    }

    #[test]
    fn test_bees_control() {
        let mut sim = BeesSimulation::new();

        sim.set_parameter("bees_mean".into(), 2)
            .expect("Bees parameter to be set");

        sim.set_parameter("cluster_radius".into(), 0.001)
            .expect("cluster parameter to be set");

        sim.set_parameter("fruits_mean", 1)
            .expect("Fruits parameter to be set");

        let region = [32.416, -85.707, 32.42, -85.701];

        let group1 = experiment_group(
            "bees", region, 20, true, false, false, false, false, "gridded",
        );
        let group2 = experiment_group(
            "control", region, 20, false, false, false, false, false, "random",
        );
        let group3 = experiment_group(
            "cluster",
            region,
            20,
            false,
            false,
            false,
            false,
            false,
            "clustered",
        );
        let groups = ParameterValue::RepeatedOption(vec![
            ParameterValue::OptionGroup(group1),
            ParameterValue::OptionGroup(group2),
            ParameterValue::OptionGroup(group3),
        ]);

        sim.set_parameter("groups", groups)
            .expect("To be able to set group parameter");
        let result = sim.run().expect("To be able to run the simulation");

        assert_eq!(result.shape().0, 60);

        println!("result is {:#?}", result);
    }
}
