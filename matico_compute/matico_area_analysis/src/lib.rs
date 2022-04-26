use arrow2::{datatypes::Schema, chunk::Chunk, array::Array};
use matico_analysis::*;
use serde::{Serialize,Deserialize};
use std::{collections::HashMap, sync::Arc};
use wasm_bindgen::prelude::*;

#[matico_spec_derive::matico_compute]
pub struct AreaAnalysis{}


impl MaticoAnalysisRunner for AreaAnalysis{
    fn run(&mut self) -> Result<(), ProcessError>{
        Ok(())
    }

    fn options() -> HashMap<String, ParameterOptions>{
        let mut options: HashMap<String,ParameterOptions> = HashMap::new();
        options.insert(
            "geometry column".into(),
            ParameterOptions::Text(Default::default()),
        );
        options
    }
}

#[cfg(test)]
mod tests {
    use crate::{AreaAnalysis, MaticoAnalysis, MaticoAnalysisRunner, ParameterValue};

    fn test_data() -> Vec<u8> {
        std::fs::read(format!(
            "{}/resources/test.arrow",
            env!("CARGO_MANIFEST_DIR")
        ))
        .expect("Should have got test arrow file")
    }

    #[test]
    fn test_matico_analysis() {
        let mut buffer_analysis = AreaAnalysis::new();
        let test_data = test_data();

        buffer_analysis.set_parameter("geom_col", ParameterValue::Text(String::from("geometry"))).expect("Should be allowed to set parameter");
        let table_result = buffer_analysis.register_table("target_table", &test_data);
        println!("Table result {:?}", table_result);
        buffer_analysis.run();
    }
}
