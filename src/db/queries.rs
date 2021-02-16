use crate::db::formatters::*;
use crate::db::DataDbPool;
use crate::errors::ServiceError;
use crate::models::Column;
use crate::utils::PaginationParams;
use log::info;
use log::warn;
use serde::{Deserialize, Serialize};
use std::convert::From;
use std::f64::consts::PI;

#[derive(Serialize, Deserialize)]
pub struct BBox {
    x_min: f32,
    x_max: f32,
    y_min: f32,
    y_max: f32,
}

#[derive(Serialize, Deserialize)]
pub struct Bounds {
    bounds: Option<BBox>,
}

#[derive(Serialize, Deserialize)]
pub struct TilerOptions {
    geom_column: Option<String>,
    tollerance: Option<u64>,
    crs: Option<String>,
}

#[derive(Deserialize)]
pub struct TileID {
    x: f64,
    y: f64,
    z: f64,
}

pub fn bbox(tile_id: &TileID) -> [f64; 4] {
    let x = tile_id.x;
    let y = tile_id.y;
    let z = tile_id.z;

    let max = 6378137.0 * PI;
    let res = max * 2.0 / (2.0 as f64).powf(z as f64) as f64;

    [
        -max + (x as f64) * res,
        max - ((y as f64) * res),
        -max + (x as f64) * res + res,
        max - ((y as f64) * res) - res,
    ]
}

#[derive(PartialEq, Debug)]
pub struct MVTTile {
    pub mvt: Vec<u8>,
}

pub struct PostgisQueryRunner;

impl PostgisQueryRunner {
    pub fn paginate_query(query: &str, page: Option<PaginationParams>) -> String {
        let page_str = match page {
            Some(page) => page.to_string(),
            None => String::from(""),
        };
        format!(
            "select * from ({sub_query}) as a {page}",
            sub_query = query,
            page = page_str
        )
    }

    pub async fn run_query(
        pool: &DataDbPool,
        query: &str,
        page: Option<PaginationParams>,
        format: &str,
    ) -> Result<serde_json::Value, ServiceError> {
        let conn = pool.get().await.expect("Pool Error!");

        let paged_query = Self::paginate_query(query, page);

        let formatted_query = match format {
            "csv" => Ok(csv_format(&paged_query)),
            "geojson" => Ok(geo_json_format(&paged_query)),
            "json" => Ok(json_format(&paged_query)),
            _ => Err(ServiceError::BadRequest(format!(
                "unrecognized format {}",
                format
            ))),
        }?;

        info!("running query {}", formatted_query);

        let result: serde_json::Value = conn
            .query_one(formatted_query.as_str(), &[])
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, formatted_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
            })?
            .get("res");
        Ok(result)
    }

    pub async fn get_query_column_details(
        pool: &DataDbPool,
        query: &str,
    ) -> Result<Vec<Column>, ServiceError> {
        let conn = pool.get().await.expect("Pool Error!");
        let page = PaginationParams {
            limit: Some(1),
            offset: Some(9),
        };

        let paged_query = Self::paginate_query(&query, Some(page));
        let result = conn
            .query_one(paged_query.as_str(), &[])
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, paged_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, paged_query))
            })?;

        let columns: Vec<Column> = result
            .columns()
            .iter()
            .map(|col| Column {
                name: col.name().into(),
                col_type: col.type_().name().into(),
                source_query: query.clone().into(),
            })
            .collect();

        Ok(columns)
    }

    pub async fn run_tile_query(
        pool: &DataDbPool,
        query: &str,
        tiler_options: TilerOptions,
        tile_id: TileID,
    ) -> Result<MVTTile, ServiceError> {
        let conn = pool.get().await.expect("Pool Error!");
        let bbox = bbox(&tile_id);

        let geom_column = match tiler_options.geom_column {
            Some(column) => column,
            None => String::from("wkb_geometry"),
        };
        let formatted_query = format!(
            include_str!("tile_query.sql"),
            geom_column = geom_column,
            tile_table = query,
            x_min = bbox[0],
            y_min = bbox[1],
            x_max = bbox[2],
            y_max = bbox[3]
        );

        let result: Vec<u8> = conn
            .query_one(formatted_query.as_str(), &[])
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, formatted_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
            })?
            .get("mvt");

        Ok(MVTTile { mvt: result })
    }
}
