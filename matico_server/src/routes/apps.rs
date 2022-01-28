use crate::app_state::State;
use crate::auth::AuthService;

use crate::errors::ServiceError;
use crate::models::{
    App, AppOrderBy, AppSearch, CreateAppDTO, Permission, PermissionType, ResourceType,
    UpdateAppDTO, UserToken,
};
use crate::utils::PaginationParams;
use actix_web::{delete, get, post, put, web, HttpResponse};
use log::info;
use serde_json::json;
use uuid::Uuid;

#[get("")]
pub async fn get_apps(
    state: web::Data<State>,
    web::Query(search): web::Query<AppSearch>,
    web::Query(order): web::Query<AppOrderBy>,
    web::Query(page): web::Query<PaginationParams>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let mut search = search;

    if let Some(user) = logged_in_user.user {
        if search.user_id == None {
            search.user_id = Some(user.id);
        }
    } else {
        search.public = Some(true)
    };

    let apps = App::search(&state.db, order, search, Some(page))?;
    Ok(HttpResponse::Ok().json(apps))
}

#[post("")]
pub async fn create_app(
    state: web::Data<State>,
    logged_in_user: AuthService,
    web::Json(mut new_app): web::Json<CreateAppDTO>,
) -> Result<HttpResponse, ServiceError> {
    info!("Attpempting to create app");
    let user: UserToken = logged_in_user
        .user
        .ok_or_else(|| ServiceError::Unauthorized("No user logged in".into()))?;

    info!("Have user {:?}", user);
    info!("new app {:?}", new_app);

    new_app.owner_id = Some(user.id);

    let app = App::create(&state.db, new_app)?;

    Permission::grant_permissions(
        &state.db,
        user.id,
        app.id,
        ResourceType::App,
        vec![
            PermissionType::Read,
            PermissionType::Write,
            PermissionType::Admin,
        ],
    )?;

    Ok(HttpResponse::Ok().json(app))
}

#[delete("/{app_id}")]
pub async fn delete_app(
    state: web::Data<State>,
    web::Path(app_id): web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let app = App::find(&state.db, app_id)?;

    let user = logged_in_user
        .user
        .ok_or_else(|| ServiceError::Unauthorized("No user logged in".into()))?;

    if user.id != app.owner_id {
        Permission::check_permission(&state.db, &user.id, &app_id, PermissionType::Admin)?;
    }

    App::delete(&state.db, app_id)?;
    Ok(HttpResponse::Ok().json(json!({ "deleted": app_id })))
}

#[put("/{app_id}")]
pub async fn update_app(
    state: web::Data<State>,
    web::Path(app_id): web::Path<Uuid>,
    web::Json(update): web::Json<UpdateAppDTO>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user = logged_in_user
        .user
        .ok_or_else(|| ServiceError::Unauthorized("No user logged in".into()))?;
    Permission::check_permission(&state.db, &user.id, &app_id, PermissionType::Write)?;
    let update = App::update(&state.db, app_id, update)?;
    Ok(HttpResponse::Ok().json(update))
}

#[get("/{app_id}")]
pub async fn get_app(
    state: web::Data<State>,
    web::Path(app_id): web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let app = App::find(&state.db, app_id)?;
    if let Some(user) = logged_in_user.user {
        if !app.public && user.id != app.owner_id {
            Permission::require_permissions(&state.db, &user.id, &app_id, &[PermissionType::Read])?;
        }
    }
    Ok(HttpResponse::Ok().json(app))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_apps);
    cfg.service(update_app);
    cfg.service(delete_app);
    cfg.service(create_app);
    cfg.service(get_app);
}
