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
use std::convert::TryInto;
use std::{
    collections::{BTreeMap, HashMap},
    io::{Cursor, Read, Seek, SeekFrom},
    sync::Arc,
};
use wkb::{geom_to_wkb, wkb_to_geom};
use web_sys::*;
use wasm_bindgen::prelude::*;

use rusty_machine::learning::dbscan::DBSCAN;
use rusty_machine::learning::UnSupModel;
use rusty_machine::linalg::Matrix;

#[matico_spec_derive::matico_compute]
pub struct HDBScanAnalysis {}

impl MaticoAnalysisRunner for HDBScanAnalysis {
    fn run(&mut self) -> Result<Vec<u8>, ProcessError> {

        // {
        //     *no
        // } else {
        //     2000
        // };
        //
        let min_dist= if let Ok(ParameterValue::NumericFloat(no)) = self.get_parameter("min_dist")
        {
            *no
        } else {
            0.001
        };

        let min_clust= if let Ok(ParameterValue::NumericInt(no)) = self.get_parameter("min_clust")
        {
            *no
        } else {
            20
        };

        let (source_table_schema, source_table_cols) = self.tables.get("source_dataset").unwrap();
        let geom_pos =  source_table_schema.fields.iter().position(|c| c.name == "geom").unwrap();

        // let count_col_name = if let Ok(ParameterValue::Column(col))= self.get_parameter("pop_col"){
        //     Ok(col)
        // }
        // else{
        //     Err(ProcessError{})
        // }?;

        console::log_1(&format!("Schema {:#?}",source_table_schema).into());

        // let value_pos =  source_table_schema.fields.iter().position(|c| c.name == *count_col_name).unwrap();

        // console::log_1(&format!("val pos {:#?}",value_pos).into());

        // let mut rng = rand::thread_rng(); let mut points:Vec<Vec<u8>> = vec![];
        
        let mut points: Vec<f64>  = vec![];
        let mut new_geoms : Vec<_> = vec![];

        for chunk in source_table_cols.iter(){
            let geoms_raw = chunk.get(geom_pos).unwrap();

            new_geoms.push(geoms_raw.clone());

            let geoms_raw = match geoms_raw.data_type().to_physical_type(){
                PhysicalType::Binary => Ok(geoms_raw.as_any().downcast_ref::<BinaryArray<i32>>().unwrap()),
                _ => Err(ProcessError{
                    parameters: self.parameter_values.clone(),
                    error:"Geom wasn't a binary array".into()
                })
            }?;

            for (index,wkb) in geoms_raw.iter().enumerate(){
                if wkb.is_some(){
                    let mut cursor = Cursor::new(wkb.unwrap());
                    let geom: Geometry<f64>= wkb_to_geom(&mut cursor).unwrap();

                    if let Geometry::Point(point) = geom{
                        points.push(point.x());
                        points.push(point.y());
                    }
                    else{
                        panic!("This analysis only works with points");
                    }
                }
            }

        }

        let inputs = Matrix::new(points.len()/2, 2, points);

        let mut model = DBSCAN::new(min_dist.into(), min_clust.try_into().unwrap());

        model.train(&inputs).map_err(|e| ProcessError{
            parameters: self.parameter_values.clone(),
            error: format!("Failed to run DBSCAN {:#?}",e)
        })?;
        console::log_1(&format!("trained model").into());
   
        let clustering = model.clusters().ok_or_else(|| ProcessError{
            parameters: self.parameter_values.clone(),
            error: format!("extract clusters from model ")
        })?;

        let clustering: Vec<Option<u32>> = clustering.data().iter().map(|opt| opt.map(|v| v as u32)).collect();

        console::log_1(&format!("Got clusters {:#?}", clustering).into());

        let schema = Schema::from(vec![
            Field::new("geom", DataType::Binary, false),
            Field::new("cluster_labels", DataType::UInt32, false),
        ]);


        let cluster_labels=  PrimitiveArray::<u32>::from(clustering);

        let batch = Chunk::try_new(vec![
            new_geoms.first().unwrap().clone() as Arc<dyn Array>,
            Arc::new(cluster_labels) as Arc<dyn Array>
        ]).unwrap();

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
        Some("Cluster the provided points in to clusters".into()) 
    }

    fn options() -> BTreeMap<String, ParameterOptions> {
        let mut options: BTreeMap<String, ParameterOptions> = BTreeMap::new();

        options.insert("min_dist".into(), ParameterOptions::NumericFloat(NumericFloatOptions{
            default: Some(0.0001 ),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("Minimum distance between points to include in cluster".into()),
                display_name:Some("Minimum cluster dist".into())
            }
        }));

        options.insert("min_dist".into(), ParameterOptions::NumericInt(NumericIntOptions{
            default: Some(20),
            range: None,
            display_details:ParameterOptionDisplayDetails{
                description:Some("Minimum no of points in cluster".into()),
                display_name:Some("Min cluster no".into())
            }
        }));

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

        options
    }
}

#[cfg(test)]
mod tests {

}
