use crate::db::DbPool;
use actix_web::{web, HttpResponse, Error};
use diesel::sql_query;
use diesel::sql_types::{BigInt, Bytea, Integer,Text};
use crate::diesel::RunQueryDsl;

use serde::Deserialize;

use std::f64::consts::PI;

#[derive( QueryableByName, PartialEq, Debug)]
pub struct MVTTile{
    // #[sql_type = "Integer"]
    // id:i32,
    #[sql_type = "Bytea"]
    mvt:Vec<u8>
}

pub fn bbox(tile_id: &TileID) -> [f64;4]{
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
pub struct TileID{
    x:f64,
    y:f64,
    z:f64
}

pub fn run_tile_query(conn: &diesel::pg::PgConnection, query: &str)->Result<MVTTile, diesel::result::Error>{
    sql_query(query).get_result(conn)
}

pub async fn get_tile(pool: web::Data<DbPool>, tile_id : web::Path<TileID>)->Result<HttpResponse,Error>{
    let bbox  = bbox(&tile_id);
    let query = format!(include_str!("tile_query.sql"), tile_table="gz_2010_us_outline_20m",
        x_min=bbox[0],
        y_min=bbox[1],
        x_max = bbox[2],
        y_max = bbox[3]
    );
    let conn  = pool.get().expect("couldn't get db connection from pool");
    let mvt_tile: MVTTile = web::block(move ||
       run_tile_query(&conn, &query) 
    ).await?;
    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}