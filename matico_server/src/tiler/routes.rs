use std::collections::HashMap;
use crate::app_state::State;
use crate::db::{MVTTile, PostgisDataSource, TileID, TilerOptions, DataSource};
use crate::errors::ServiceError;
use crate::models::{Dataset,Api};
use actix_web::{get, web, HttpResponse};
use actix_web_lab::extract::Path;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct QueryParam {
    q: String,
}

#[derive(Serialize, Deserialize)]
struct DatasetID {
    dataset_id: Uuid,
}

#[derive(Serialize, Deserialize)]
struct ApiID {
    api_id: Uuid,
}

#[get("/{z}/{x}/{y}")]
async fn get_tile(
    state: web::Data<State>,
    Path(tile_id): Path<TileID>,
    web::Query(query): web::Query<QueryParam>,
    web::Query(tiler_options): web::Query<TilerOptions>,
) -> Result<HttpResponse, ServiceError> {
    let mvt_tile: MVTTile =
        PostgisDataSource::run_tile_query(&state.data_db, &query.q, tiler_options, tile_id)
            .await?;
    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

//TODO Change this to use the datasets known geometry column
//Once we can do that
#[get("/dataset/{dataset_id}/{z}/{x}/{y}")]
async fn get_tile_for_dataset(
    state: web::Data<State>,
    Path(dataset): Path<DatasetID>,
    Path(tile_id): Path<TileID>,
    Path(tiler_options): Path<TilerOptions>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset.dataset_id)?;
    let query = format!(r#"select * from "{}""#, dataset.table_name);

    let mvt_tile =
        PostgisDataSource::run_tile_query(&state.data_db, &query, tiler_options, tile_id)
            .await?;

    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

#[get("/api/{api_id}/{z}/{x}/{y}")]
async fn get_tile_for_query(
    state: web::Data<State>,
    Path(api): Path<ApiID>,
    Path(tile_id): Path<TileID>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
    Path(tiler_options): Path<TilerOptions>,
)-> Result<HttpResponse, ServiceError>{
   let api = Api::find(&state.db, api.api_id)?;
   let query = api.construct_query(&params)?;


    let mvt_tile =
        PostgisDataSource::run_tile_query(&state.data_db, &query, tiler_options, tile_id)
            .await?;

    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_tile);
    cfg.service(get_tile_for_dataset);
    cfg.service(get_tile_for_query);
}
