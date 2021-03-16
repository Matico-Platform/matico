use crate::app_state::State;
use crate::auth::AuthService;
use crate::models::permissions::{Permission, PermissionType};
use crate::models::users::UserToken;

use crate::errors::ServiceError;
use crate::models::dashboards::{
    CreateDashboardDTO, Dashboard, DashboardOrderBy, DashboardSearch, UpdateDashboardDTO,
};
use crate::utils::PaginationParams;
use actix_web::{delete, get, post, put, web, HttpResponse};
use serde_json::json;
use uuid::Uuid;

#[get("")]
pub async fn get_all_dashboards(
    state: web::Data<State>,
    web::Query(search): web::Query<DashboardSearch>,
    web::Query(order): web::Query<DashboardOrderBy>,
    web::Query(page): web::Query<PaginationParams>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let mut search = search.clone();

    if let Some(user) = logged_in_user.user {
        if search.user_id == None {
            search.user_id = Some(user.id);
        }
    } else {
        search.public = Some(true)
    };

    let dashboards = Dashboard::search(&state.db, order, search, Some(page))?;
    Ok(HttpResponse::Ok().json(dashboards))
}

#[post("")]
pub async fn create_dashboard(
    state: web::Data<State>,
    logged_in_user: AuthService,
    web::Json(mut new_dataset): web::Json<CreateDashboardDTO>,
) -> Result<HttpResponse, ServiceError> {
    let user: UserToken = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;

    new_dataset.owner_id = Some(user.id);

    let dashboard = Dashboard::create(&state.db, new_dataset)?;
    Ok(HttpResponse::Ok().json(dashboard))
}

#[delete("/{dashboard_id}")]
pub async fn delete_dashboard(
    state: web::Data<State>,
    web::Path(dashboard_id): web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;
    Permission::check_permission(&state.db, &user.id, &dashboard_id, PermissionType::WRITE)?;

    Dashboard::delete(&state.db, dashboard_id)?;
    Ok(HttpResponse::Ok().json(json!({ "deleted": dashboard_id })))
}

#[put("/{dashboard_id}")]
pub async fn update_dashboard(
    state: web::Data<State>,
    web::Path(dashboard_id): web::Path<Uuid>,
    web::Json(update): web::Json<UpdateDashboardDTO>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;
    Permission::check_permission(&state.db, &user.id, &dashboard_id, PermissionType::WRITE)?;
    let update = Dashboard::update(&state.db, dashboard_id, update)?;
    Ok(HttpResponse::Ok().json(update))
}

#[get("/{dashboard_id}")]
pub async fn get_dashboard(
    state: web::Data<State>,
    web::Path(dashboard_id): web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let dashboard = Dashboard::find(&state.db, dashboard_id)?;
    if let Some(user) = logged_in_user.user {
        if !dashboard.public && user.id != dashboard.owner_id {
            Permission::require_permissions(
                &state.db,
                &user.id,
                &dashboard_id,
                &vec![PermissionType::READ],
            )?;
        }
    }
    Ok(HttpResponse::Ok().json(dashboard))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all_dashboards);
    cfg.service(update_dashboard);
    cfg.service(delete_dashboard);
    cfg.service(create_dashboard);
    cfg.service(get_dashboard);
}
