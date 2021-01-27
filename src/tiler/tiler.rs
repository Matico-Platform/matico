use crate::db::DbPool;
use crate::diesel::RunQueryDsl;
use crate::errors::ServiceError;
use crate::models::Dataset;
use actix_web::{get, web, Error, HttpResponse};
use diesel::sql_query;
use diesel::sql_types::Bytea;
use serde::{Deserialize, Serialize};
use std::f64::consts::PI;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct DatasetID {
    dataset_id: Uuid,
}

#[derive(QueryableByName, PartialEq, Debug)]
pub struct MVTTile {
    // #[sql_type = "Integer"]
    // id:i32,
    #[sql_type = "Bytea"]
    mvt: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
struct TilerOptions {
    geom_column: Option<String>,
    tollerance: Option<u64>,
    crs: Option<String>,
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

#[derive(Deserialize)]
pub struct TileID {
    x: f64,
    y: f64,
    z: f64,
}

pub fn run_tile_query(
    conn: &diesel::pg::PgConnection,
    query: &str,
) -> Result<MVTTile, diesel::result::Error> {
    sql_query(query).get_result(conn)
}

#[get("/")]
async fn test() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().json("HEY! TILES"))
}

#[get("/{z}/{x}/{y}")]
async fn get_tile(
    pool: web::Data<DbPool>,
    web::Path(tile_id): web::Path<TileID>,
    web::Query(query): web::Query<String>,
    web::Query(tiler_options): web::Query<TilerOptions>,
) -> Result<HttpResponse, Error> {
    let bbox = bbox(&tile_id);

    let geom_column = match tiler_options.geom_column {
        Some(column) => column,
        None => String::from("wkt_geometry"),
    };
    let query = format!(
        include_str!("tile_query.sql"),
        geom_column = geom_column,
        tile_table = query,
        x_min = bbox[0],
        y_min = bbox[1],
        x_max = bbox[2],
        y_max = bbox[3]
    );
    let conn = pool.get().expect("couldn't get db connection from pool");
    let mvt_tile: MVTTile = web::block(move || run_tile_query(&conn, &query)).await?;
    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

//TODO Change this to use the datasets known geometry column
//Once we can do that
#[get("/{dataset_id}/{z}/{x}/{y}")]
async fn get_tile_for_dataset(
    pool: web::Data<DbPool>,
    web::Path(dataset): web::Path<DatasetID>,
    web::Path(tile_id): web::Path<TileID>,
    web::Path(tiler_options): web::Path<TilerOptions>,
) -> Result<HttpResponse, ServiceError> {
    let conn = pool
        .get()
        .map_err(|_| ServiceError::InternalServerError("Database Connection Failed".into()))?;

    let dataset = Dataset::find(pool.get_ref(), dataset.dataset_id)?;

    let geom_column = match tiler_options.geom_column {
        Some(column) => column,
        None => String::from("wkb_geometry"),
    };

    let bbox = bbox(&tile_id);
    let query = format!(
        include_str!("tile_query.sql"),
        tile_table = dataset.name,
        geom_column = geom_column,
        x_min = bbox[0],
        y_min = bbox[1],
        x_max = bbox[2],
        y_max = bbox[3]
    );

    let mvt_tile: MVTTile = web::block(move || run_tile_query(&conn, &query))
        .await
        .map_err(|e| ServiceError::InternalServerError(format!("Failed to get tile: {}", e)))?;
    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_tile);
    cfg.service(get_tile_for_dataset);
    cfg.service(test);
}
