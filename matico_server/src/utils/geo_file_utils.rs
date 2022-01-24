use crate::app_config::Config;
use crate::errors::ServiceError;
use actix_web::web;
use gdal::errors::GdalError;
use gdal::Dataset;
use log::info;
use serde::{Serialize,Deserialize};
use std::path::{Path};
use std::process::Command;
use diesel_as_jsonb::AsJsonb;

#[derive(Serialize, Deserialize, Debug, AsJsonb,Clone)]
pub enum ImportParams{
    Csv(CSVImportParams),
    GeoJson(GeoJsonImportParams),
    Shp(ShpFileImportParams)
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub  struct CSVImportParams{
    x_col : Option<String>,
    y_col : Option<String>,
    epsg  : Option<String>,
    wkx_col :Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GeoJsonImportParams{
    input_crs: Option<String>,
    target_crs: Option<String>
} 

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ShpFileImportParams{
}

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

pub async fn load_dataset_to_db(filepath: String, name:String, params: ImportParams) ->Result<(), ServiceError>{
    match params{
        ImportParams::Csv(params)=> load_csv_dataset_to_db(filepath, name, params).await,
        ImportParams::GeoJson(params)=> load_geojson_dataset_to_db(filepath, name, params).await,
        ImportParams::Shp(params)=> load_shp_dataset_to_db(filepath, name, params).await
    }
}

pub async fn load_shp_dataset_to_db(_filepath: String, _name:String, _params:ShpFileImportParams)->Result<(),ServiceError>{
    Err(
        ServiceError::InternalServerError("Importing SHP files not implemented just yet".into())
    )
}

pub async fn load_geojson_dataset_to_db(filepath: String, name: String, params: GeoJsonImportParams) -> Result<(), ServiceError> {
    info!("Attempting to load file {} to table {}", filepath, name);
    let config = Config::from_conf().unwrap();
    let ogr_string = config.org_connection_string()?;
    let output = web::block(move || {
        let mut cmd =Command::new("ogr2ogr");
         cmd.arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name);

        if let Some(target_crs) = params.target_crs{
            cmd.arg(&"-t_srs")
            .arg(&target_crs);
        }
        if let Some(input_crs) = params.input_crs{
            cmd.arg(&"-a_srs")
            .arg(&input_crs);
        }
            cmd.arg(&filepath)
            .output()
    })
    .await
    .map_err(|_| ServiceError::UploadFailed)?;

    info!("Uploaded geo file {:?} ", output);
    Ok(())
}

pub async fn load_csv_dataset_to_db(filepath: String, name: String, params: CSVImportParams)-> Result<(), ServiceError>{
    info!("Attempting to load file {} to table {}", filepath, name);
    let config = Config::from_conf().unwrap();
    let ogr_string = config.org_connection_string()?;
    let output = web::block(move || {
        let mut cmd = Command::new("ogr2ogr");
            cmd.arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name)
            .arg("-oo")
            .arg("AUTODETECT_TYPE=YES");

        if let Some(x_col)= params.x_col{
            cmd.arg("-oo")
               .arg(format!("X_POSSIBLE_NAMES={}",x_col));
        }
        if let Some(y_col) = params.y_col{
            cmd.arg("-oo")
               .arg(format!("Y_POSSIBLE_NAMES={}",y_col));
        }
        if let Some(wkx_col) = params.wkx_col{
             cmd.arg("-oo")
                .arg(format!("GEOM_POSSIBLE_NAMES={}",wkx_col));
        }
        cmd.arg(&filepath);
        cmd.output()
    })
    .await
    .map_err(|_| ServiceError::UploadFailed)?;

    info!("Uploaded geo file {:?} ", output);
    Ok(())
}

//IGNORE THESE TESTS FOR NOW 
#[cfg(test)]
mod tests{
    use std::path::{PathBuf};
    use gdal::{Dataset};

    #[test]
    fn get_correct_file_info_shp(){
        let mut d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        d.push("resources/test/ne_10m_admin_0_countries.zip");
        let dataset = Dataset::open(d.as_path());
        println!("Dataset {:#?}",dataset);
        
    }

    #[test]
    fn get_correct_file_info_geojson(){
        let mut d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        d.push("resources/test/squirrel.geojson");
        let dataset = Dataset::open(d.as_path());
        println!("Dataset {:#?}",dataset);
        
    }
}
