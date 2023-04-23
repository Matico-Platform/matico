use core::fmt;

use geo::{Geometry, Point};
use geopolars::geoseries::GeoSeries;
use matico_analysis::{DataFrame, ProcessError, Series};
use polars::prelude::*;
use rand::Rng;
use rand_distr::{Distribution, Poisson};

#[derive(Debug, PartialEq)]
pub enum Experiment {
    NoBees,
    NoFruits,
    Wind,
    Soil,
    Proximity,
}

impl fmt::Display for Experiment {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NoBees => write!(f, "bees"),
            Self::NoFruits => write!(f, "fruits"),
            Self::Wind => write!(f, "wind"),
            Self::Soil => write!(f, "soil"),
            Self::Proximity => write!(f, "proximity"),
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum Layout {
    Random,
    Gridded,
}
#[derive(Debug)]
pub struct Group {
    region: [f64; 4],
    name: String,
    no_observations: u32,
    experiments: Vec<Experiment>,
    layout: Layout,
}

impl Group {
    pub fn new(
        name: &str,
        region: [f64; 4],
        no_observations: u32,
        experiments: Vec<Experiment>,
        layout: Layout,
    ) -> Self {
        Self {
            name: String::from(name),
            region,
            no_observations,
            experiments,
            layout,
        }
    }
}

pub struct Simulation {
    groups: Vec<Group>,
    bees_mean: u32,
    fruits_base: u32,
}

impl Simulation {
    pub fn new(groups: Vec<Group>, bees_mean: u32, fruits_base: u32) -> Self {
        Self {
            groups,
            bees_mean,
            fruits_base,
        }
    }

    pub fn generate_group_setup(&self, group: &Group, group_no: u32) -> DataFrame {
        let no_observations = group.no_observations;
        let group_no: Vec<u32> = (0..no_observations).map(|_| group_no).collect();

        println!("No observations in group {:#?}", no_observations);

        let bees_control: Vec<bool> =
            vec![group.experiments.contains(&Experiment::NoBees); no_observations as usize];

        let group_name: Vec<String> = vec![group.name.clone(); no_observations as usize];

        let fruit_control: Vec<bool> =
            vec![group.experiments.contains(&Experiment::NoFruits); no_observations as usize];

        let wind_control: Vec<bool> =
            vec![group.experiments.contains(&Experiment::Wind); no_observations as usize];

        let soil_control: Vec<bool> =
            vec![group.experiments.contains(&Experiment::Soil); no_observations as usize];

        let proximity_control: Vec<bool> =
            vec![group.experiments.contains(&Experiment::Proximity); no_observations as usize];

        let locations = self.generate_tree_locations(group).unwrap();

        println!("No observations in bees control{:#?}", bees_control);

        DataFrame::new(vec![
            Series::new("group", group_no),
            Series::new("group_name", group_name),
            Series::new("bees_control", bees_control),
            Series::new("fruit_control", fruit_control),
            Series::new("proximity_control", proximity_control),
            Series::new("wind_control", wind_control),
            Series::new("soil_control", soil_control),
            Series::new("geom", locations),
        ])
        .unwrap()
    }

    pub fn run(&self) -> DataFrame {
        let mut rng = rand::thread_rng();

        let group_dfs: Vec<DataFrame> = self
            .groups
            .iter()
            .enumerate()
            .map(|(group_no, group)| {
                println!("Group is {:#?}", group);
                let mut inputs = self.generate_group_setup(&group, group_no as u32);
                println!("inputs are {:#?}", inputs);
                let total_observations = inputs.shape().0;
                let poi = Poisson::new(self.bees_mean as f32).unwrap();

                let bees: Vec<f32> = inputs
                    .column("bees_control")
                    .unwrap()
                    .bool()
                    .unwrap()
                    .into_iter()
                    .map(|control| match control {
                        Some(true) => 0.0,
                        Some(false) => poi.sample(&mut rng),
                        None => 0.0,
                    })
                    .collect();
                let bees = Series::new("bees", bees);
                inputs.with_column(bees).unwrap();
                inputs
            })
            .collect();
        let mut group_iter = group_dfs.into_iter();

        let mut df = group_iter.next().unwrap();
        for df2 in group_iter {
            df.extend(&df2);
        }

        self.calc_objective_function(df)
    }

    pub fn calc_objective_function(&self, data_frame: DataFrame) -> DataFrame {
        let mut rng = rand::thread_rng();

        let bees_factor = 2.0;
        let within_distance_factor = 2.0;

        // let trees_within_distance = data_frame.column("trees_in_distance");

        let mean = data_frame
            .clone()
            .lazy()
            .select([(col("bees") * lit(bees_factor) + lit(self.fruits_base)).alias("fruits")])
            .collect()
            .expect("To be able to calculate the objective function ok");

        let fruits: Vec<f64> = mean
            .column("fruits")
            .unwrap()
            .f32()
            .unwrap()
            .into_iter()
            .zip(data_frame.column("fruit_control").unwrap().bool().unwrap())
            .map(|(fruit, control)| {
                if control.unwrap() {
                    0.0
                } else {
                    let pos = Poisson::new(fruit.unwrap() as f64).unwrap();
                    let val: f64 = pos.sample(&mut rng);
                    val
                }
            })
            .collect();

        let fruits_series = Series::new("fruits".into(), fruits);
        data_frame.hstack(&[fruits_series]).unwrap()
    }

    pub fn generate_random_tree_distribution(
        &self,
        no_points: u32,
        ranges: &[f64; 4],
    ) -> std::result::Result<Vec<Geometry<f64>>, ProcessError> {
        let mut rng = rand::thread_rng();

        let points: Vec<Geometry<f64>> = (0..no_points)
            .map(|_| {
                let y: f64 = rng.gen_range(ranges[0]..ranges[2]);
                let x: f64 = rng.gen_range(ranges[1]..ranges[3]);
                Geometry::Point(Point::<f64>::new(x as f64, y as f64))
            })
            .collect();

        Ok(points)
    }

    fn generate_grid_tree_distribution(
        &self,
        no_trees: u32,
        region: &[f64; 4],
    ) -> std::result::Result<Vec<Geometry<f64>>, ProcessError> {
        // let mut rng = rand::thread_rng();
        // let x_extent = region[0][1] - region[0][1];
        // let y_extent = region[1][1] - region[1][1];
        //
        // // let no_not_control = no_trees - no_control / 2;
        //
        // let nx: f32 = ((x_extent / y_extent) * (no_not_control as f32)
        //     + (x_extent - y_extent).powi(2) / (4.0 * y_extent.powi(2)))
        // .sqrt()
        //     - (x_extent - y_extent) / (2.0 * y_extent).floor();
        //
        // let nx: usize = nx.floor() as usize;
        //
        // let ny: usize = no_control / nx;
        //
        // let x_spacing: f32 = (x_extent) / (nx as f32);
        // let y_spacing: f32 = (x_extent) / (ny as f32);
        //
        // let mut points: Vec<Geometry<f64>> = vec![];
        // let mut partner_points: Vec<Geometry<f64>> = vec![];
        //
        // for i in 0..nx {
        //     for j in 0..ny {
        //         let x: f32 = self.region[0][0] + (i as f32) * x_spacing;
        //         let y: f32 = self.region[1][0] + (j as f32) * y_spacing;
        //         points.push(Geometry::Point(Point::<f64>::new(x as f64, y as f64)))
        //     }
        // }
        //
        // for partner in points.choose_multiple(&mut rng, no_control / 2) {
        //     let angle: f64 = rng.gen_range(0.1..2.0 * std::f64::consts::PI);
        //     let dist: f64 = rng.gen_range(0.1..1.0) * bee_fly_distance;
        //
        //     if let Geometry::Point(p) = partner {
        //         let x = p.x() * angle.sin() * dist;
        //         let y = p.y() * angle.cos() * dist;
        //         partner_points.push(Geometry::Point(Point::<f64>::new(x as f64, y as f64)));
        //     }
        // }
        // points.extend(partner_points);
        // Ok(points)
        Ok(vec![])
    }

    fn generate_tree_locations(&self, group: &Group) -> std::result::Result<Series, ProcessError> {
        let bee_fly_distance = 20.0;
        let no_proximity_control = 0;

        let trees: Vec<Geometry<f64>> = match group.layout {
            Layout::Gridded => {
                self.generate_grid_tree_distribution(group.no_observations, &group.region)
            }
            Layout::Random => {
                self.generate_random_tree_distribution(group.no_observations, &group.region)
            }
            _ => Err(ProcessError {
                error: "Unsupported tree layout".into(),
            }),
        }?;

        let geo_series = Series::from_geom_vec(&trees).map_err(|e| ProcessError {
            error: format!("Failed to construct geo series {:#?}", e),
        })?;

        Ok(geo_series)
    }
}
