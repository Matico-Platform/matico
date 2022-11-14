use geo::Geometry;
use geozero::{wkb::Wkb, ToGeo};
pub use matico_common::*;
pub use polars::prelude::{DataFrame, Series};
use std::collections::BTreeMap;

pub trait MaticoAnalysis {
    fn get_parameter(&self, param_name: &str) -> Result<&ParameterValue, ArgError>;
    fn set_parameter(&mut self, param_name: &str, value: ParameterValue) -> Result<(), ArgError>;
    fn register_table(&mut self, name: &str, data: &[u8]) -> Result<(), ArgError>;
}

pub trait MaticoAnalysisRunner {
    fn options() -> BTreeMap<String, ParameterOptions>;
    fn run(&mut self) -> Result<DataFrame, ProcessError>;
    fn description() -> Option<String>;
}

pub fn iter_geom(series: &Series) -> impl Iterator<Item = Geometry<f64>> + '_ {
    let chunks = series.list().expect("series was not a list type");
    let iter = chunks.into_iter();
    iter.map(|row| {
        let value = row.expect("Row is null");
        let buffer = value.u8().expect("Row is not type u8");
        let vec: Vec<u8> = buffer.into_iter().map(|x| x.unwrap()).collect();
        Wkb(vec).to_geo().expect("unable to convert to geo")
    })
}
