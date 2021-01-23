use crate::errors::ServiceError;
use gdal::errors::GdalError;
use gdal::{Dataset};
use std::path::Path;
use actix_web::web;
use std::process::Command;
use log::{info};

pub fn get_file_info(filepath: &str) -> Result<Vec<(String, u32, i32)>, GdalError> {
    let mut dataset = Dataset::open(Path::new(filepath))?;
    let layer = dataset.layer(0)?;
    let fields = layer
        .defn()
        .fields()
        .map(|field| (field.name(), field.field_type(), field.width()))
        .collect::<Vec<_>>();
    Ok(fields)
}


pub async fn load_dataset_to_db(filepath: String, name: String)->Result<(),ServiceError>{
    info!("Attempting to load file {} to table {}", filepath,name);
    
    let output = web::block(move ||{
       Command::new("ogr2ogr")
       .arg(&"-f")
       .arg(&"PostgreSQL")
       .arg(&"PG:dbname=stuart user=stuart")
       .arg(&"-nln")
       .arg(&name)
       .arg(&filepath)
       .output()
   }).await.map_err(|_| ServiceError::UploadFailed)?;

   info!("It apparently worked {:?} ", output);
   Ok(())
}