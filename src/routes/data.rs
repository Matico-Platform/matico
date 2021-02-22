use crate::app_state::State;
use crate::db::Bounds;
use crate::errors::ServiceError;
use crate::models::Dataset;
use crate::utils::{Format, FormatParam, PaginationParams};
use actix_web::{get, put, web, HttpResponse};
use uuid::Uuid;

#[get("{dataset_id}/data")]
async fn get_data(
    state: web::Data<State>,
    web::Path(dataset_id): web::Path<Uuid>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;
    let result = dataset
        .query(&state.data_db, None, Some(page), format_param.format)
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[get("{dataset_id}/data/{feature_id}")]
async fn get_feature(
    state: web::Data<State>,
    web::Path((dataset_id, feature_id)): web::Path<(Uuid, String)>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;

    let id_col = &dataset.id_col;
    let table = &dataset.name;
    let query = format!(
        "Select * from {table} where {id_col} ={feature_id}",
        table = table,
        id_col = id_col,
        feature_id = feature_id
    );

    let result = dataset
        .query(&state.data_db, Some(query), None, Some(Format::JSON))
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[put("{dataset_id}/data/{feature_id}")]
async fn update_feature(
    state: web::Data<State>,
    web::Path((dataset_id, feature_id)): web::Path<(Uuid, String)>,
    web::Json(update): web::Json<serde_json::Value>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;
    let result = dataset
        .update_feature(&state.db, feature_id, update)
        .await?;
    Ok(HttpResponse::Ok().json(result))
}
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_feature);
    cfg.service(get_data);
    cfg.service(update_feature);
}
