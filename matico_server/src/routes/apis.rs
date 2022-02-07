use crate::routes::columns::ColumnStatRequest;
use crate::models::StatParams;
use crate::app_state::State;
use crate::auth::AuthService;
use crate::db::Bounds;
use crate::errors::ServiceError;

use crate::models::{
    apis::{AnnonQuery, Api, CreateAPIDTO, UpdateAPIDTO},
    permissions::*,
    users::*,
};
use crate::utils::{FormatParam, PaginationParams};
use std::collections::HashMap;

use actix_web::{delete, get, post, put, web, HttpResponse};
use uuid::Uuid;

#[get("/{id}")]
async fn get_api(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let query = Api::find(&state.db, id)?;
    Ok(HttpResponse::Ok().json(query))
}

#[get("")]
async fn get_apis(
    state: web::Data<State>,
    web::Query(page): web::Query<PaginationParams>,
) -> Result<HttpResponse, ServiceError> {
    let queries = Api::search(&state.db, page)?;
    Ok(HttpResponse::Ok().json(queries))
}

#[delete("/{id}")]
async fn delete_api(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    Api::delete(&state.db, id)?;
    Ok(HttpResponse::Ok().json(format!("Deleted api {}", id)))
}

#[put("/{id}")]
async fn update_api(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
    web::Json(update_params): web::Json<UpdateAPIDTO>,
) -> Result<HttpResponse, ServiceError> {
    let result = Api::update(&state.db, id, update_params)?;
    Ok(HttpResponse::Ok().json(result))
}

#[post("")]
async fn create_api(
    state: web::Data<State>,
    web::Json(create_query): web::Json<CreateAPIDTO>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {

    let user: UserToken = logged_in_user
        .user
        .ok_or_else(|| ServiceError::Unauthorized("No user logged in".into()))?;

    let query = Api::create(&state.db, create_query)?;

    Permission::grant_permissions(
        &state.db,
        user.id,
        query.id,
        ResourceType::Dataset,
        vec![
            PermissionType::Read,
            PermissionType::Write,
            PermissionType::Admin,
        ],
    )?;
    Ok(HttpResponse::Ok().json(query))
}

#[get("/run")]
async fn run_annon_query(
    state: web::Data<State>,
    web::Query(query): web::Query<AnnonQuery>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(_bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
) -> Result<HttpResponse, ServiceError> {
    let result = Api::run_raw(&state.data_db, query.q, Some(page), format_param.format).await?;
    // let result = "{\"test\":\"test\"}";
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}


#[get("{api_id}/columns/{column_name}/stats")]
async fn get_column_stats(
    state: web::Data<State>,
    web::Path((api_id, column_name)): web::Path<(Uuid, String)>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(request_details): web::Query<ColumnStatRequest>,
) -> Result<HttpResponse, ServiceError> {
    let api= Api::find(&state.db, api_id)?;

    let stat_params: StatParams = serde_json::from_str(&request_details.stat).map_err(|e| {
        ServiceError::BadRequest(format!(
            "Stat request was miss-specification \n {} \n {}",
            request_details.stat, e
        ))
    })?;

    let col = api.get_column(&state.data_db, column_name, params).await?;
    let result = col.calc_stat(&state.data_db, stat_params, None).await?;

    Ok(HttpResponse::Ok().json(result))
}

#[get("/{api_id}/columns")]
async fn get_columns(
    state: web::Data<State>,
    web::Path(query_id): web::Path<Uuid>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(_bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>)-> Result<HttpResponse,ServiceError>{

    let query = Api::find(&state.db, query_id)?;
    let columns = query.columns(&state.data_db, params,).await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .json(columns))
}

#[get("/{api_id}/run")]
async fn run_api(
    state: web::Data<State>,
    web::Path(query_id): web::Path<Uuid>,
    web::Query(params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(_bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
) -> Result<HttpResponse, ServiceError> {
    let query = Api::find(&state.db, query_id)?;
    let result = query
        .run(&state.data_db, params, Some(page), format_param.format)
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(run_annon_query);
    cfg.service(get_apis);
    cfg.service(get_api);
    cfg.service(delete_api);
    cfg.service(update_api);
    cfg.service(create_api);
    cfg.service(get_column_stats);
    cfg.service(get_columns);
    cfg.service(run_api);
    // cfg.service(run_query);
}
