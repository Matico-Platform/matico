use core::fmt;

use geo::algorithm::EuclideanDistance;
use geo::{Geometry, Point};
use geopolars::geoseries::GeoSeries;
use matico_analysis::{DataFrame, ProcessError, Series};
use polars::prelude::*;
use rand::Rng;
use rand_distr::{num_traits::ToPrimitive, Distribution, Poisson};

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
    Clustered,
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
    cluster_size: f64,
    proximity_factor: f64,
}

impl Simulation {
    pub fn new(
        groups: Vec<Group>,
        bees_mean: u32,
        fruits_base: u32,
        cluster_size: f64,
        proximity_factor: f64,
    ) -> Self {
        Self {
            groups,
            bees_mean,
            fruits_base,
            cluster_size,
            proximity_factor,
        }
    }
    pub fn no_within(&self, points: &Vec<Point<f64>>, threshold: f64) -> Series {
        let mut counts: Vec<u32> = Vec::with_capacity(points.len());
        for p1 in points.iter() {
            let mut count_within = 0;
            for p2 in points.iter() {
                let distance = p1.euclidean_distance(p2);
                if distance < threshold {
                    count_within = count_within + 1
                }
            }
            counts.push(count_within);
        }

        Series::new("within_distance", counts)
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

        println!(
            "no_observations {} locations length {}",
            no_observations,
            locations.len()
        );

        let counts_within = self.no_within(&locations, 0.001);

        let locations: Vec<Geometry<f64>> = locations.iter().map(|l| Geometry::Point(*l)).collect();

        let locations = Series::from_geom_vec(&locations).unwrap();

        DataFrame::new(vec![
            Series::new("group", group_no),
            // Series::new("group_name", group_name),
            Series::new("bees_control", bees_control),
            Series::new("fruit_control", fruit_control),
            Series::new("proximity_control", proximity_control),
            Series::new("wind_control", wind_control),
            Series::new("soil_control", soil_control),
            counts_within,
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
            .select([(col("bees") * lit(bees_factor)
                + lit(self.fruits_base)
                + col("within_distance") * lit(self.proximity_factor))
            .alias("fruits")])
            .collect()
            .expect("To be able to calculate the objective function ok");

        let fruits: Vec<f64> = mean
            .column("fruits")
            .unwrap()
            .f64()
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
    ) -> std::result::Result<Vec<Point<f64>>, ProcessError> {
        let mut rng = rand::thread_rng();

        let points: Vec<Point<f64>> = (0..no_points)
            .map(|_| {
                let y: f64 = rng.gen_range(ranges[0]..ranges[2]);
                let x: f64 = rng.gen_range(ranges[1]..ranges[3]);
                Point::<f64>::new(x, y)
            })
            .collect();

        Ok(points)
    }

    fn generate_clustered_tree_distribution(
        &self,
        no_trees: u32,
        region: &[f64; 4],
        cluster_size: f64,
    ) -> std::result::Result<Vec<Point<f64>>, ProcessError> {
        let mut rng = rand::thread_rng();
        let mut points: Vec<Point<f64>> = vec![];
        let poisson = Poisson::new(6.0).unwrap();

        while (points.len() as u32) < no_trees {
            println!("points length {} {}", points.len(), no_trees);
            let no_in_cluster = std::cmp::min(
                poisson.sample(&mut rng).to_u32().unwrap(),
                no_trees - points.len() as u32,
            );
            let cluster_center_y: f64 = rng.gen_range(region[0]..region[2]);
            let cluster_center_x: f64 = rng.gen_range(region[1]..region[3]);

            for _ in 0..no_in_cluster {
                let theta = rng.gen_range(0.0..(2.0 * std::f64::consts::PI));
                let r = rng.gen_range(0.0..cluster_size);
                let x = cluster_center_x + theta.sin() * r;
                let y = cluster_center_y + theta.cos() * r;
                points.push(Point::<f64>::new(x, y));
            }
        }

        Ok(points)
    }

    fn generate_grid_tree_distribution(
        &self,
        no_trees: u32,
        region: &[f64; 4],
    ) -> std::result::Result<Vec<Point<f64>>, ProcessError> {
        let root_trees: f64 = (no_trees as f64).sqrt().ceil();
        let root_trees_int: u32 = root_trees.to_u32().unwrap();

        let region_height = region[2] - region[0];
        let region_width = region[3] - region[1];
        let mut points: Vec<Point<f64>> = vec![];

        for x_int in 0..root_trees_int {
            for y_int in 0..root_trees_int {
                if (points.len() as u32) < no_trees {
                    let x = region[1] + x_int as f64 * region_width / root_trees;
                    let y = region[0] + y_int as f64 * region_height / root_trees;
                    println!(
                        "x {} y {} width :{} height:{} root-trees int {}",
                        x, y, region_width, region_height, root_trees_int
                    );
                    points.push(Point::<f64>::new(x, y));
                }
            }
        }

        println!("points {:#?}", points);

        Ok(points)
    }

    fn generate_tree_locations(
        &self,
        group: &Group,
    ) -> std::result::Result<Vec<Point<f64>>, ProcessError> {
        let bee_fly_distance = 20.0;
        let no_proximity_control = 0;

        let trees: Vec<Point<f64>> = match group.layout {
            Layout::Gridded => {
                self.generate_grid_tree_distribution(group.no_observations, &group.region)
            }
            Layout::Random => {
                self.generate_random_tree_distribution(group.no_observations, &group.region)
            }
            Layout::Clustered => self.generate_clustered_tree_distribution(
                group.no_observations,
                &group.region,
                self.cluster_size,
            ),

            _ => Err(ProcessError {
                error: "Unsupported tree layout".into(),
            }),
        }?;

        Ok(trees)
    }
}
