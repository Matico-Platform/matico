use arrow2::chunk::Chunk;
use arrow2::io::ipc::read;
use arrow2::datatypes::{Schema, PhysicalType };
use arrow2::io::ipc::read::{read_file_metadata, FileReader};
use arrow2::array::{Array,PrimitiveArray, BinaryArray};
use std::sync::Arc;
use wkb::*;
use geo_types::*;
use geo::algorithm::area::Area;

use geo::{line_string, point, polygon};
use std::io::Cursor;
mod matico_analysis;
mod parameter_options;
mod parameter_values;
pub use matico_analysis::*;
pub use parameter_options::*;
pub use parameter_values::*;
use serde::{Serialize,Deserialize};

use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[derive(Serialize,Deserialize)]
pub struct AreaAnalysis {
    parameter_values: HashMap<String, ParameterValue>,
    options: HashMap<String, ParameterOptions>,
    #[serde(skip)]
    tables: HashMap<String, (Schema, Vec<Chunk<Arc<dyn Array>>>)>,
}

impl AreaAnalysis {
    fn new() -> Self {
        let mut options = HashMap::new();
        options.insert(
            "geometry column".into(),
            ParameterOptions::Text(Default::default()),
        );
        Self {
            parameter_values: HashMap::new(),
            options,
            tables: HashMap::new(),
        }
    }
}


#[wasm_bindgen]
struct AnalysisInterface{
    analysis: AreaAnalysis
} 

#[wasm_bindgen]
impl AnalysisInterface{
    #[wasm_bindgen]
    pub fn new()->Self{
        Self{
            analysis: AreaAnalysis::new()
        }
    }

    #[wasm_bindgen]
    pub fn options(&self)->JsValue{
        JsValue::from_serde(&self.analysis.options()).unwrap()
    }

    #[wasm_bindgen]
    pub fn register_table(&mut self, table_name:&str, data:&[u8])->Result<(),JsValue>{
        self.analysis.register_table(table_name, data)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    } 

    #[wasm_bindgen]
    pub fn set_parameter(&mut self, parameter_name:&str, value: JsValue)->Result<(),JsValue>{
        let v :ParameterValue = value.into_serde()
                                     .map_err(|e| JsValue::from_str("Bad parameter format"))?;

        self.analysis.set_parameter(parameter_name, v)
            .map_err(|e| JsValue::from_str(&e.to_string()))
    } 
}

impl MaticoAnalysis for AreaAnalysis {
    fn get_parameter(&self, parameter_name: &str) -> Result<&ParameterValue, ArgError> {
        self.parameter_values
            .get(parameter_name)
            .ok_or(ArgError::new(parameter_name, "Does not exist"))
    }

    fn set_parameter(
        &mut self,
        parameter_name: &str,
        value: ParameterValue,
    ) -> Result<(), ArgError> {
        let parameter_options = self
            .options
            .get(parameter_name)
            .ok_or(ArgError::new(parameter_name, "Does not exist"))?;

        parameter_options
            .validate_parameter(&value)
            .map_err(|e| ArgError::new(parameter_name, &e))?;
        self.parameter_values.insert(parameter_name.into(), value);
        Ok(())
    }

    fn options(&self) -> &HashMap<String, ParameterOptions> {
        &self.options
    }

    fn run(&mut self) -> Result<(), ProcessError> {
        let input_table = self.tables.get("target_table").ok_or_else(|| ProcessError{})?;

        if let Ok(ParameterValue::Text(geom_col)) = self.get_parameter("geom_col").map_err(|_| ProcessError{}){
            
            let (schema, columns)  = &input_table;
            let geom_col_index = schema.fields.iter().position(|f| f.name==*geom_col).unwrap();
            
            println!("Columns are {:#?} schema {:#?} geom_col index {}", columns, schema, geom_col_index);

            for chunk in columns{
                let areas:Vec<f64> = match chunk[geom_col_index].data_type().to_physical_type(){
                    PhysicalType::Binary =>{
                        let array = chunk[geom_col_index].as_any().downcast_ref::<BinaryArray<i32>>().unwrap();

                        let geoms: Vec<Geometry<f64>> = array.values_iter().map(|v| {
                            let mut cursor = Cursor::new(v);
                            cursor.read_wkb().unwrap() 
                        }).collect();

                        let areas: Vec<f64> = geoms.iter().map(|geom|{
                            geom.signed_area()
                        }).collect();
                        Ok(areas)
                    },
                    _ => Err(ProcessError{})
                }?;


                println!("calculated areas {:?}",areas);
            };
            Ok(())
        }
        else{
            Err(ProcessError{})
        }
    }

    fn register_table(&mut self, table_name: &str, data: &[u8]) -> Result<(), ArgError> {
        let mut reader = Cursor::new(data);
        let metadata = read::read_file_metadata(&mut reader)
            .map_err(|e| ArgError::new(table_name, &format!("Failed to load table {:#?}", e)))?;

        let schema = metadata.schema.clone();
        let reader = FileReader::new(reader, metadata, None);

        println!("Schema is {:#?}",schema);

        let columns = reader
            .collect::<arrow2::error::Result<Vec<_>>>()
            .map_err(|e| ArgError::new(table_name, &format!("Failed to get columns of table {:#?}",e)))?;

        self.tables.insert(table_name.into(), (schema, columns));
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{AreaAnalysis, MaticoAnalysis, ParameterValue};

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

        buffer_analysis.set_parameter("geom_col", ParameterValue::Text(String::from("geometry")));
        let table_result = buffer_analysis.register_table("target_table", &test_data);
        println!("Table result {:?}", table_result);
        buffer_analysis.run();
    }
}
