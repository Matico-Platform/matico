use crate::db::formatters::*;
use crate::db::DataDbPool;
use crate::errors::ServiceError;
use crate::models::Column as DatasetColumn;
use crate::utils::{Format, PaginationParams};
use log::info;
use log::warn;
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::Column;
use sqlx::Row;
use sqlx::TypeInfo;
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
    let res = max * 2.0 / 2.0_f64.powf(z as f64) as f64;

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
        format: Format,
    ) -> Result<serde_json::Value, ServiceError> {
        let paged_query = Self::paginate_query(query, page);

        let formatted_query = match format {
            Format::Csv => Ok(csv_format(&paged_query)),
            Format::Geojson => Ok(geo_json_format(&paged_query)),
            Format::Json => Ok(json_format(&paged_query)),
        }?;

        info!("running query {}", formatted_query);

        let result: String = sqlx::query(&formatted_query)
            .map(|row: PgRow| row.get("res"))
            .fetch_one(pool)
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, formatted_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
            })?;
        let json: serde_json::Value = serde_json::from_str(&result)
            .map_err(|_| ServiceError::InternalServerError("failed to parse json".into()))?;
        Ok(json)
    }

    pub async fn get_query_column_details(
        pool: &DataDbPool,
        query: &str,
    ) -> Result<Vec<DatasetColumn>, ServiceError> {
        let columns = sqlx::query(query)
            .map(|row: PgRow| {
                let cols = row.columns();
                let columns: Vec<DatasetColumn> = cols
                    .iter()
                    .map(|col| DatasetColumn {
                        name: col.name().to_string(),
                        col_type: col.type_info().name().into(),
                        source_query: query.into(),
                    })
                    .collect();
                columns
            })
            .fetch_one(pool)
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, query))
            })?;

        Ok(columns)
    }

    pub async fn run_anon_tile_query(
        pool: &DataDbPool,
        query: &str,
        tiler_options: TilerOptions,
        tile_id: TileID,
    ) -> Result<MVTTile, ServiceError> {
        // TODO This is an annoying and potentially non preformat
        // way of getting the columns names we want to include.
        // One solution will be to require the passing of the
        // required columns in the query. Another might be to see
        // if we can easily cache this call in the server. Better would
        // be if postgresql had an exclude keyword or if we can find some
        // other way to do this in the db
        let columns = Self::get_query_column_details(&pool, query).await?;

        let column_names: Vec<String> = columns
            .iter()
            .filter(|col| col.col_type != "geometry")
            .map(|col| format!("\"{}\"", col.name))
            .collect();
        let select_string = column_names.join(",");

        let bbox = bbox(&tile_id);

        let geom_column = match tiler_options.geom_column {
            Some(column) => column,
            None => String::from("wkb_geometry"),
        };
        let formatted_query = format!(
            include_str!("tile_query.sql"),
            columns = select_string,
            geom_column = geom_column,
            tile_table = query,
            x_min = bbox[0],
            y_min = bbox[1],
            x_max = bbox[2],
            y_max = bbox[3]
        );

        let result: Vec<u8> = sqlx::query(&formatted_query)
            .map(|row: PgRow| row.get("mvt"))
            .fetch_one(pool)
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, formatted_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
            })?;

        Ok(MVTTile { mvt: result })
    }
}
