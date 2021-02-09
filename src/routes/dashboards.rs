use crate::auth::AuthService;
use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::dashboards::{
    CreateDashboardDTO, Dashboard, DashboardOrderBy, DashboardSearch, UpdateDashboardDTO,
};
use crate::utils::PaginationParams;
use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use serde_json::json;
use uuid::Uuid;

#[get("")]
pub async fn get_all_dashboards(
    db: web::Data<DbPool>,
    web::Query(search): web::Query<DashboardSearch>,
    web::Query(order): web::Query<DashboardOrderBy>,
    web::Query(page): web::Query<PaginationParams>,
) -> Result<HttpResponse, ServiceError> {
    let dashboards = Dashboard::search(db.get_ref(), order, search, Some(page))?;
    Ok(HttpResponse::Ok().json(dashboards))
}

#[post("")]
pub async fn create_dashboard(
    db: web::Data<DbPool>,
    user_token: AuthService,
    web::Json(mut new_dataset): web::Json<CreateDashboardDTO>,
) -> Result<HttpResponse, ServiceError> {
    new_dataset.owner_id = Some(user_token.user.unwrap().id);

    let dashboard = Dashboard::create(db.get_ref(), new_dataset)?;
    Ok(HttpResponse::Ok().json(dashboard))
}

#[delete("/{dataset_id}")]
pub async fn delete_dashboard(
    db: web::Data<DbPool>,
    web::Path(dataset_id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    Dashboard::delete(db.get_ref(), dataset_id)?;

    Ok(HttpResponse::Ok().json(json!({ "deleted": dataset_id })))
}

#[put("/{dataset_id}")]
pub async fn update_dashboard(
    db: web::Data<DbPool>,
    web::Path(dataset_id): web::Path<Uuid>,
    web::Json(update): web::Json<UpdateDashboardDTO>,
) -> Result<HttpResponse, ServiceError> {
    let update = Dashboard::update(db.get_ref(), dataset_id, update)?;
    Ok(HttpResponse::Ok().json(update))
}
