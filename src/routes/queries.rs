use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::queries::{CreateQueryDTO, Params, Query, UpdateQueryDTO};
use crate::utils::PaginationParams;
use serde::{Serialize,Deserialize};

use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use uuid::Uuid;


#[derive(Serialize, Deserialize)]
struct QueryString {
    q: Option<String>,
}


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

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_queries);
    cfg.service(get_query);
    cfg.service(delete_query);
    cfg.service(update_query);
    cfg.service(create_query);
    cfg.service(update_query);
    // cfg.service(run_query);
}
