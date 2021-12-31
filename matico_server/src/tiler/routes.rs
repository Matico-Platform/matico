use crate::app_state::State;
use crate::db::{MVTTile, PostgisQueryRunner, TileID, TilerOptions};
use crate::errors::ServiceError;
use crate::models::Dataset;
use actix_web::{get, web, HttpResponse};
use serde::{Deserialize, Serialize};
use uuid::Uuid;


#[derive(Serialize,Deserialize)]
struct QueryParam{
    q:String 
}

#[derive(Serialize, Deserialize)]
struct DatasetID {
    dataset_id: Uuid,
}

#[get("/{z}/{x}/{y}")]
async fn get_tile(
    state: web::Data<State>,
    web::Path(tile_id): web::Path<TileID>,
    web::Query(query): web::Query<QueryParam>,
    web::Query(tiler_options): web::Query<TilerOptions>,
) -> Result<HttpResponse, ServiceError> {
    let mvt_tile: MVTTile =
        PostgisQueryRunner::run_anon_tile_query(&state.data_db, &query.q, tiler_options, tile_id).await?;
    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

//TODO Change this to use the datasets known geometry column
//Once we can do that
#[get("/dataset/{dataset_id}/{z}/{x}/{y}")]
async fn get_tile_for_dataset(
    state: web::Data<State>,
    web::Path(dataset): web::Path<DatasetID>,
    web::Path(tile_id): web::Path<TileID>,
    web::Path(tiler_options): web::Path<TilerOptions>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset.dataset_id)?;
    let query = format!(r#"select * from "{}""#, dataset.name.to_lowercase());

    let mvt_tile =
        PostgisQueryRunner::run_anon_tile_query(&state.data_db, &query, tiler_options, tile_id).await?;

    Ok(HttpResponse::Ok().body(mvt_tile.mvt))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_tile);
    cfg.service(get_tile_for_dataset);
}
