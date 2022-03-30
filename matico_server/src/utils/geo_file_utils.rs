use crate::errors::ServiceError;
use actix_web::web;
use diesel_as_jsonb::AsJsonb;
use log::info;
use serde::{Deserialize, Serialize};
use std::process::Command;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, AsJsonb, Clone)]
pub enum ImportParams {
    Csv(CSVImportParams),
    GeoJson(GeoJsonImportParams),
    Shp(ShpFileImportParams),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CSVImportParams {
    // The column to use as the x coord on datasets that are considered points.
    // Defaults to "longitude"
    x_col: Option<String>,

    // The column to use as the y coord on datasets that are considered points
    // Defaults to "latitude"
    y_col: Option<String>,

    // The coordinate reference system (e.g. epsg:4326)
    // Defaults to "epsg:4326"
    crs: Option<String>,

    // The column that contains either the wkb or wkt values for geometries
    // Defaults to None
    wkx_col: Option<String>,
}

impl Default for CSVImportParams {
    fn default() -> Self {
        Self {
            x_col: Some("longitude".into()),
            y_col: Some("latitude".into()),
            crs: Some("epsg:4326".into()),
            wkx_col: None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GeoJsonImportParams {
    // If the importing GeoJson isn't in epsg:4326, what crs is it in
    #[serde(default)]
    input_crs: Option<String>,

    // What crs should we transform this dataset to when importing
    #[serde(default)]
    target_crs: Option<String>,
}

impl Default for GeoJsonImportParams {
    fn default() -> Self {
        Self {
            input_crs: Some("epsg:4326".into()),
            target_crs: Some("epsg:4326".into()),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ShpFileImportParams {}

pub async fn load_dataset_to_db(
    filepath: String,
    name: String,
    params: ImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
    println!("Loading to db {:#?} {:#?}", params, ogr_string);
    match params {
        ImportParams::Csv(params) => {
            load_csv_dataset_to_db(filepath, name, params, ogr_string).await
        }
        ImportParams::GeoJson(params) => {
            load_geojson_dataset_to_db(filepath, name, params, ogr_string).await
        }
        ImportParams::Shp(params) => {
            load_shp_dataset_to_db(filepath, name, params, ogr_string).await
        }
    }
}

/// Attempts to unzip a shp file 
/// Returns the path to the .shp file in the unziped folder
///
fn attempt_to_unzip_shp_file(filepath: &str)->Result<(String, String), ServiceError>{
    let tmp_dir= format!("./tmp/{}",Uuid::new_v4()); 
    std::fs::create_dir_all(&tmp_dir).map_err(|_| ServiceError::InternalServerError("Failed to create tmp dir on shp import".into()))?;

    // First extract the zip file to a dir
    let zip_file = std::fs::File::open(&filepath).map_err(|_| ServiceError::InternalServerError("Failed to find the import shp zip".into()))?;
    let mut zip_archive = zip::ZipArchive::new(zip_file).map_err(|_| ServiceError::InternalServerError("Failed to open zip archive while importing shp".into()))?;

    let mut shp_file: Option<String> = None;
    
    for i in 0..zip_archive.len(){
        let mut file = zip_archive.by_index(i).unwrap();
        let out_name = match file.enclosed_name(){
            Some(path) => path.to_owned(),
            None => continue
        };

        if let Some(extension) = out_name.extension(){
            if extension.to_string_lossy() == "shp"{
               shp_file = Some(out_name.to_string_lossy().to_string());
            }
            if ["shp","shx","dbf","prj"].contains(&extension.to_str().unwrap()){
               let out_path = format!("{}/{}", tmp_dir, out_name.to_string_lossy());
               let mut out_file = std::fs::File::create(&out_path).unwrap();
               std::io::copy(&mut file, &mut out_file).unwrap();
            }
        }
    }
    if let Some(found_shp) = shp_file{
        Ok((tmp_dir.clone(), format!("{}/{}",tmp_dir, found_shp)))
    }
    else{
        std::fs::remove_dir_all(tmp_dir.clone());
        Err(ServiceError::InternalServerError("zip file did not contain a file with .shp extension".into()))
    }
}

pub async fn load_shp_dataset_to_db(
    filepath: String,
    name: String,
    params: ShpFileImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {

    let (tmp_dir, filepath) = attempt_to_unzip_shp_file(&filepath)?;
    let ogr_result= web::block(move || {
        let mut cmd = Command::new("ogr2ogr");
        cmd.arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name)
            .arg(&"-nlt")
            .arg(&"PROMOTE_TO_MULTI")
            .arg(filepath)
            .output()
    })
    .await
    .map_err(|e| ServiceError::InternalServerError(format!("Failed to load shp file to db {:#?}",e)))?;
    std::fs::remove_dir_all(&tmp_dir.clone()).unwrap();
    Ok(())
}

pub async fn load_geojson_dataset_to_db(
    filepath: String,
    name: String,
    params: GeoJsonImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
    println!("Attempting to load file {} to table {}", filepath, name);
    let output = web::block(move || {
        let mut cmd = Command::new("ogr2ogr");
        cmd.arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name)
            .arg("-oo")
            .arg("autodetect_type=yes");

        if let Some(target_crs) = params.target_crs {
            cmd.arg(&"-t_srs").arg(&target_crs);
        }

        if let Some(input_crs) = params.input_crs {
            cmd.arg(&"-a_srs").arg(&input_crs);
        }

        cmd.arg(&filepath).output()
    })
    .await
    .map_err(|_| ServiceError::UploadFailed)?;

    info!("Uploaded geo file {:?} ", output);
    Ok(())
}

pub async fn load_csv_dataset_to_db(
    filepath: String,
    name: String,
    params: CSVImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
    println!("Attempting to load file {} to table {}", filepath, name);
    let output = web::block(move || {
        let mut cmd = Command::new("ogr2ogr");
        cmd.arg(&"-f")
            .arg(&"PostgreSQL")
            .arg(ogr_string)
            .arg(&"-nln")
            .arg(&name)
            .arg("-oo")
            .arg("autodetect_type=yes");

        if let Some(x_col) = params.x_col {
            cmd.arg("-oo").arg(format!("X_POSSIBLE_NAMES={}", x_col));
        }
        if let Some(y_col) = params.y_col {
            cmd.arg("-oo").arg(format!("Y_POSSIBLE_NAMES={}", y_col));
        }
        if let Some(wkx_col) = params.wkx_col {
            cmd.arg("-oo")
                .arg(format!("GEOM_POSSIBLE_NAMES={}", wkx_col));
        }
        cmd.arg("-a_srs").arg("EPSG:4326");
        cmd.arg(format!("CSV:{}", filepath));
        cmd.output()
    })
    .await
    .map_err(|e| {
        println!("FAILED TO RUN OGR {:#?}", e);
        ServiceError::UploadFailed
    })?;

    println!("Uploaded geo file {:?} ", output);
    Ok(())
}

//IGNORE THESE TESTS FOR NOW
#[cfg(test)]
mod tests {
    use gdal::Dataset;
    use std::path::PathBuf;

    #[test]
    fn get_correct_file_info_shp() {
        let mut d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        d.push("resources/test/ne_10m_admin_0_countries.zip");
        let dataset = Dataset::open(d.as_path());
        println!("Dataset {:#?}", dataset);
    }

    #[test]
    fn get_correct_file_info_geojson() {
        let mut d = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        d.push("resources/test/squirrel.geojson");
        let dataset = Dataset::open(d.as_path());
        println!("Dataset {:#?}", dataset);
    }
}
