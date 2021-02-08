use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::queries::{AnnonQuery, CreateQueryDTO, Query, UpdateQueryDTO};
use crate::utils::PaginationParams;
use std::collections::HashMap;

use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use uuid::Uuid;

#[get("/{id}")]
async fn get_query(
    db: web::Data<DbPool>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let query = Query::find(db.get_ref(), id)?;
    Ok(HttpResponse::Ok().json(query))
}

#[get("")]
async fn get_queries(
    db: web::Data<DbPool>,
    web::Query(page): web::Query<PaginationParams>,
) -> Result<HttpResponse, ServiceError> {
    let queries = Query::search(db.get_ref(), page)?;
    Ok(HttpResponse::Ok().json(queries))
}

#[delete("/{id}")]
async fn delete_query(
    db: web::Data<DbPool>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    Query::delete(db.get_ref(), id)?;
    Ok(HttpResponse::Ok().json(format!("Deleted query {}", id)))
}

#[put("/{id}")]
async fn update_query(
    db: web::Data<DbPool>,
    web::Path(id): web::Path<Uuid>,
    web::Json(update_params): web::Json<UpdateQueryDTO>,
) -> Result<HttpResponse, ServiceError> {
    let result = Query::update(db.get_ref(), id, update_params)?;
    Ok(HttpResponse::Ok().json(result))
}

#[post("")]
async fn create_query(
    db: web::Data<DbPool>,
    web::Json(create_query): web::Json<CreateQueryDTO>,
) -> Result<HttpResponse, ServiceError> {
    info!("HERE!!!!");
    let result = Query::create(db.get_ref(), create_query)?;
    Ok(HttpResponse::Ok().json(result))
}

#[get("/run")]
async fn run_annon_query(
    db: web::Data<DbPool>,
    web::Query(query): web::Query<AnnonQuery>,
) -> Result<HttpResponse, ServiceError> {
    info!("HERERE!!!");
    let result = Query::run_raw(db.get_ref(), query.q).await?;
    // let result = "{\"test\":\"test\"}";
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[get("/{query_id}/run")]
async fn run_query(
    db: web::Data<DbPool>,
    web::Path(query_id): web::Path<Uuid>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
) -> Result<HttpResponse, ServiceError> {
    let query = Query::find(db.get_ref(), query_id)?;
    let result = query.run(db.get_ref(), params).await?;
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
