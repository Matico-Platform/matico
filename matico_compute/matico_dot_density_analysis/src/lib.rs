use arrow2::array::PrimitiveArray;
use arrow2::datatypes::{DataType, Field, Schema, PhysicalType, PrimitiveType};
use arrow2::io::ipc::write;
use arrow2::{
    array::{Array, BinaryArray},
    chunk::Chunk,
};
use geo::prelude::{BoundingRect,Contains};
use geo_types::{Geometry, Point};
use matico_analysis::*;
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::{
    collections::{BTreeMap, HashMap},
    io::{Cursor, Read, Seek, SeekFrom},
    sync::Arc,
};
use wasm_bindgen::prelude::*;
use wkb::{geom_to_wkb, wkb_to_geom};
use web_sys::*;


#[matico_spec_derive::matico_compute]
pub struct DotDensityAnalysis {}

impl MaticoAnalysisRunner for DotDensityAnalysis {
    fn run(&mut self) -> Result<Vec<u8>, ProcessError> {
        let no_points = if let Ok(ParameterValue::NumericInt(no)) = self.get_parameter("No points")
        {
            *no
        } else {
            2000
        };
    
        let dot_per= if let Ok(ParameterValue::NumericInt(no)) = self.get_parameter("dot_per")
        {
            *no
        } else {
            10000
        };

        let (source_table_schema, source_table_cols) = self.tables.get("source_dataset").unwrap();
        let geom_pos =  source_table_schema.fields.iter().position(|c| c.name == "geom").unwrap();

        let count_col_name = if let Ok(ParameterValue::Column(col))= self.get_parameter("pop_col"){
            Ok(col)
        }
        else{
            Err(ProcessError{})
        }?;

        

        console::log_1(&format!("Schema {:#?}",source_table_schema).into());

        let value_pos =  source_table_schema.fields.iter().position(|c| c.name == *count_col_name).unwrap();


        let mut rng = rand::thread_rng(); let mut points:Vec<Vec<u8>> = vec![];
        
        for chunk in source_table_cols.iter(){
            let geoms_raw = chunk.get(geom_pos).unwrap();
            let geoms_raw = match geoms_raw.data_type().to_physical_type(){
                PhysicalType::Binary => Ok(geoms_raw.as_any().downcast_ref::<BinaryArray<i32>>().unwrap()),
                _ => Err(ProcessError{})
            }?;

            let counts_raw = chunk.get(value_pos).unwrap();
            console::log_1(&format!("count physical val is {:#?}",counts_raw.data_type().to_physical_type()).into());

            let counts= match counts_raw.data_type().to_physical_type(){
                PhysicalType::Primitive(PrimitiveType::Float32) =>{
                    let array = counts_raw.as_any().downcast_ref::<PrimitiveArray<f32>>().unwrap();
                    Ok(array)
                },
                PhysicalType::Utf8 =>{
                    let array = counts_raw.as_any().downcast_ref::<BinaryArray<i32>>().unwrap();
                    Err(ProcessError{}) 
                },
                _ => Err(ProcessError{})
            }?;

            for (index,wkb) in geoms_raw.iter().enumerate(){
                if wkb.is_some(){
                    let no_points = counts.values()[index];
                    let no_points = no_points/(dot_per as f32);
                    console::log_1(&format!("generating {} points",no_points).into());

                    let mut cursor = Cursor::new(wkb.unwrap());
                    let geom: Geometry<f64>= wkb_to_geom(&mut cursor).unwrap();
                    let bounds = geom.bounding_rect().unwrap();
    
                    let mut count = 0;
                    while count < (no_points as u32){
                            let x: f64 = rng.gen_range(bounds.min().x..bounds.max().x);
                            let y: f64 = rng.gen_range(bounds.min().y..bounds.max().y);
                            let point = Point::<f64>::new(x, y);
                            if geom.contains(&point){
                                points.push(geom_to_wkb(&Geometry::Point(point)).unwrap());
                                count =count+1
                            }
                    }

                }
            }

        }

        let schema = Schema::from(vec![Field::new("geom", DataType::Binary, false)]);

        let geoms_binary: BinaryArray<i32> = BinaryArray::from_slice(&points);

        let batch = Chunk::try_new(vec![Arc::new(geoms_binary) as Arc<dyn Array>]).unwrap();

        let options = write::WriteOptions { compression: None };

        let cursor: Cursor<Vec<u8>> = Cursor::new(vec![]);

        let mut writer = write::FileWriter::try_new(cursor, &schema, None, options).unwrap();

        writer.write(&batch, None).unwrap();
        writer.finish().unwrap();
        let mut c = writer.into_inner();
        let mut result: Vec<u8> = Vec::new();
        c.seek(SeekFrom::Start(0)).unwrap();
        c.read_to_end(&mut result).unwrap();
        Ok(result)
    }

    fn description()->Option<String>{
        Some("This generates a number of points randonly placed within each polygon based on some input number".into()) 
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();
        options.insert(
            "source_dataset".into(),
            ParameterOptions::Table(TableOptions {
                must_have_geom: true,
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The table containing the geoms and values to dot density".into(),
                    ),
                    display_name: Some("Source Table".into()),
                },
            }),
        );

        options.insert("dot_per".into(), ParameterOptions::NumericInt(NumericIntOptions{
            default:Some(10000),
            range:Some([1,20000]),
            display_details: ParameterOptionDisplayDetails { description: Some("How many dots per numerical value".into()), display_name: Some("Dots per value".into()) },

        }));

        options.insert(
            "pop_col".into(),
            ParameterOptions::Column(ColumnOptions {
                allowed_column_types: Some(vec![ColType::Numeric]),
                from_dataset: "source_dataset".into(),
                display_details: ParameterOptionDisplayDetails {
                    description: Some(
                        "The column containing the number of points to generate".into(),
                    ),
                    display_name: Some("Point No Column".into()),
                },
            }),
        );
        options
    }
}

#[cfg(test)]
mod tests {}
