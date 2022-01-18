use crate::app_config::Config;
use crate::errors::ServiceError;
use actix_web::web;
use gdal::errors::GdalError;
use gdal::Dataset;
use log::info;
use std::path::Path;
use std::process::Command;

pub fn get_file_info(filepath: &str) -> Result<Vec<(String, u32, i32)>, GdalError> {
    let dataset = Dataset::open(Path::new(filepath))?;
    let layer = dataset.layer(0)?;
    let fields = layer
        .defn()
        .fields()
        .map(|field| (field.name(), field.field_type(), field.width()))
        .collect::<Vec<_>>();
    Ok(fields)
}

pub async fn load_dataset_to_db(filepath: String, name: String) -> Result<(), ServiceError> {
    info!("Attempting to load file {} to table {}", filepath, name);
    let config = Config::from_conf().unwrap();
    let ogr_string = config.org_connection_string()?;
    let output = web::block(move || {
        Command::new("ogr2ogr")
            .arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name)
            .arg(&filepath)
            .output()
    })
    .await
    .map_err(|_| ServiceError::UploadFailed)?;

    info!("Uploaded geo file {:?} ", output);
    Ok(())
}
