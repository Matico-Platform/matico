use crate::app_config::Config;
use crate::errors::ServiceError;
use actix_web::web;
use diesel_as_jsonb::AsJsonb;
use gdal::errors::GdalError;
use gdal::Dataset;
use log::info;
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;

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

    // The coodinate reference system (e.g. epsg:4326)
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

pub async fn load_dataset_to_db(
    filepath: String,
    name: String,
    params: ImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
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

pub async fn load_shp_dataset_to_db(
    _filepath: String,
    _name: String,
    _params: ShpFileImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
    Err(ServiceError::InternalServerError(
        "Importing SHP files not implemented just yet".into(),
    ))
}

pub async fn load_geojson_dataset_to_db(
    filepath: String,
    name: String,
    params: GeoJsonImportParams,
    ogr_string: String,
) -> Result<(), ServiceError> {
    info!("Attempting to load file {} to table {}", filepath, name);
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
    info!("Attempting to load file {} to table {}", filepath, name);
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
