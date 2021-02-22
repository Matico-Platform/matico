use crate::app_state::State;
use crate::db::Bounds;
use crate::errors::ServiceError;
use crate::models::queries::{AnnonQuery, CreateQueryDTO, Query, UpdateQueryDTO};
use crate::utils::{FormatParam, PaginationParams};
use std::collections::HashMap;

use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use uuid::Uuid;

#[get("/{id}")]
async fn get_query(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let query = Query::find(&state.db, id)?;
    Ok(HttpResponse::Ok().json(query))
}

#[get("")]
async fn get_queries(
    state: web::Data<State>,
    web::Query(page): web::Query<PaginationParams>,
) -> Result<HttpResponse, ServiceError> {
    let queries = Query::search(&state.db, page)?;
    Ok(HttpResponse::Ok().json(queries))
}

#[delete("/{id}")]
async fn delete_query(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    Query::delete(&state.db, id)?;
    Ok(HttpResponse::Ok().json(format!("Deleted query {}", id)))
}

#[put("/{id}")]
async fn update_query(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
    web::Json(update_params): web::Json<UpdateQueryDTO>,
) -> Result<HttpResponse, ServiceError> {
    let result = Query::update(&state.db, id, update_params)?;
    Ok(HttpResponse::Ok().json(result))
}

#[post("")]
async fn create_query(
    state: web::Data<State>,
    web::Json(create_query): web::Json<CreateQueryDTO>,
) -> Result<HttpResponse, ServiceError> {
    let result = Query::create(&state.db, create_query)?;
    Ok(HttpResponse::Ok().json(result))
}

#[get("/run")]
async fn run_annon_query(
    state: web::Data<State>,
    web::Query(query): web::Query<AnnonQuery>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
) -> Result<HttpResponse, ServiceError> {
    let result = Query::run_raw(&state.data_db, query.q, Some(page), format_param.format).await?;
    // let result = "{\"test\":\"test\"}";
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[get("/{query_id}/run")]
async fn run_query(
    state: web::Data<State>,
    web::Path(query_id): web::Path<Uuid>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
) -> Result<HttpResponse, ServiceError> {
    let query = Query::find(&state.db, query_id)?;
    let result = query
        .run(&state.data_db, params, Some(page), format_param.format)
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(run_annon_query);
    cfg.service(get_queries);
    cfg.service(get_query);
    cfg.service(delete_query);
    cfg.service(update_query);
    cfg.service(create_query);
    cfg.service(update_query);
    cfg.service(run_query);
    // cfg.service(run_query);
}
