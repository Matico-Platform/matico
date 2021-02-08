use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::Dataset;
use crate::utils::PaginationParams;
use actix_web::{get, put, web, HttpResponse};
use log::info;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct BBox {
    x_min: f32,
    x_max: f32,
    y_min: f32,
    y_max: f32,
}

#[derive(Serialize, Deserialize)]
struct Bounds {
    bounds: Option<BBox>,
}

#[get("{dataset_id}/data")]
async fn get_data(
    db: web::Data<DbPool>,
    web::Path(dataset_id): web::Path<Uuid>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(db.get_ref(), dataset_id)?;
    let result = dataset.query(db.get_ref(), None, Some(page)).await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[get("{dataset_id}/data/{feature_id}")]
async fn get_feature(
    db: web::Data<DbPool>,
    web::Path((dataset_id, feature_id)): web::Path<(Uuid, String)>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(db.get_ref(), dataset_id)?;

    let id_col = &dataset.id_col;
    let table = &dataset.name;
    let query = format!(
        "Select * from {table} where {id_col} ={feature_id}",
        table = table,
        id_col = id_col,
        feature_id = feature_id
    );

    let result = dataset.query(db.get_ref(), Some(query), None).await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[put("{dataset_id}/data/{feature_id}")]
async fn update_feature(
    db: web::Data<DbPool>,
    web::Path((dataset_id, feature_id)): web::Path<(Uuid, String)>,
    web::Json(update): web::Json<serde_json::Value>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(db.get_ref(), dataset_id)?;
    let result = dataset
        .update_feature(db.get_ref(), feature_id, update)
        .await?;
    Ok(HttpResponse::Ok().json(result))
}
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_feature);
    cfg.service(get_data);
    cfg.service(update_feature);
}
