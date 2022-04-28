use arrow2::{chunk::Chunk, array::{Array, BinaryArray}};
use arrow2::io::ipc::write;
use matico_analysis::*;
use rand::Rng;
use serde::{Serialize,Deserialize};
use std::{collections::HashMap, sync::Arc, io::{Cursor, Read, Seek, SeekFrom}};
use wasm_bindgen::prelude::*;
use geo_types::{Point,Geometry};
use wkb::geom_to_wkb;
use arrow2::datatypes::{DataType, Field, Schema};
 

#[matico_spec_derive::matico_compute]
pub struct DotDensityAnalysis{}


impl MaticoAnalysisRunner for DotDensityAnalysis{
    fn run(&mut self) -> Result<Vec<u8>, ProcessError>{

        let no_points = if let Ok(ParameterValue::NumericInt(no)) =  self.get_parameter("No points"){
            *no
        }
        else{
            20
        };

        let (x_min,y_min,x_max,y_max) = (-79.762152, 40.496103, -71.856214, 45.01585);
        let mut rng = rand::thread_rng();


        let points : Vec<Vec<u8>> = (0..no_points).map(|_i|{ 
            let x: f64  = rng.gen_range(x_min..x_max);
            let y: f64  = rng.gen_range(y_min..y_max);
            geom_to_wkb(&Geometry::Point( Point::<f64>::new(x,y))).unwrap()
        }
        ).collect();

       
        let schema = Schema::from(vec![
            Field::new("geom",DataType::Binary,false)
        ]);

        let geoms_binary: BinaryArray<i32>= BinaryArray::from_slice(&points);

        let batch = Chunk::try_new(vec![ Arc::new(geoms_binary) as Arc<dyn Array> ]).unwrap();

        let options = write::WriteOptions{compression:None};

        let cursor: Cursor<Vec<u8>> = Cursor::new(vec![]);

        let mut writer = write::FileWriter::try_new( cursor, &schema, None, options).unwrap();

        writer.write(&batch,None).unwrap();
        writer.finish().unwrap();
        let mut c = writer.into_inner();
        let mut result: Vec<u8> =Vec::new(); 
        c.seek(SeekFrom::Start(0)).unwrap();
        c.read_to_end(&mut result).unwrap();
        Ok(result)

    }

    fn options() -> HashMap<String, ParameterOptions>{
        let mut options: HashMap<String,ParameterOptions> = HashMap::new();
        options.insert(
            "No points".into(),
            ParameterOptions::NumericInt(NumericIntOptions{
                range: Some([0,10000]),
                default: Some(50)
            }),
        );
        options.insert(
            "dist".into(),
            ParameterOptions::Text(Default::default()),
        );
        options
    }
}

#[cfg(test)]
mod tests {
}
