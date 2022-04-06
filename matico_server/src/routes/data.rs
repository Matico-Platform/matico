use crate::app_state::State;
use crate::auth::AuthService;
use crate::db::Bounds;
use crate::db::PostgisQueryBuilder;
use crate::errors::ServiceError;
use crate::models::User;
use crate::models::permissions::*;
use crate::models::Dataset;

use crate::utils::{FormatParam, PaginationParams, SortParams};
use actix_web::{get, put, web, HttpResponse};
use actix_web_lab::extract::Path;

use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
struct QueryString{
    pub q:Option<String>
}

#[get("/query_data")]
async fn get_data_query(
    state: web::Data<State>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
    web::Query(sort): web::Query<SortParams>,
    web::Query(query_str): web::Query<QueryString>,
)->Result<HttpResponse,ServiceError>{

    let mut query =  PostgisQueryBuilder::new();
    query.page(page)
         .bounds(bounds)
         .sort(sort)
         .query(query_str.q.unwrap());

    let result = query.get_result(&state.data_db).await?;
    let geojson = result.as_geojson(None)?;

    Ok(HttpResponse::Ok()
       .content_type("application/json")
       .body(geojson))

}

#[get("/query_data_csv")]
async fn get_data_query_csv(
    state: web::Data<State>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
    web::Query(sort): web::Query<SortParams>,
    web::Query(query_str): web::Query<QueryString>,
)->Result<HttpResponse,ServiceError>{

    let mut query =  PostgisQueryBuilder::new();
    query.page(page)
         .bounds(bounds)
         .sort(sort)
         .query(query_str.q.unwrap());

    let result = query.get_result(&state.data_db).await?;
    let csv = result.as_csv()?;

    Ok(HttpResponse::Ok()
       .content_type("application/csv")
       .body(csv))

}

#[get("{dataset_id}/data")]
async fn get_data(
    state: web::Data<State>,
    Path(dataset_id): Path<Uuid>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(_bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
    web::Query(sort): web::Query<SortParams>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {

    let dataset = Dataset::find(&state.db, dataset_id)?;
    let user = User::from_token(&state.db, &logged_in_user.user);

    if let Some(user) = logged_in_user.user {
        if !dataset.public && user.id != dataset.owner_id {
            Permission::require_permissions(
                &state.db,
                &user.id,
                &dataset.id,
                &[PermissionType::Read],
            )?;
     }
    }


    let result = dataset
        .query(
            &state.data_db,
            None,
            &user,
            Some(page),
            Some(sort),
            format_param.format,
            format_param.include_metadata,
        )
        .await?;
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(result))
}

#[get("{dataset_id}/data/{feature_id}")]
async fn get_feature(
    state: web::Data<State>,
    Path((dataset_id, feature_id)): Path<(Uuid, String)>,
    web::Query(format_param): web::Query<FormatParam>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;
    let user  = User::from_token(&state.db, &logged_in_user.user);

    if !dataset.public {
        let user = logged_in_user.user.ok_or_else(|| {
            ServiceError::Unauthorized("You do not have permission to read this dataset".into())
        })?;
        Permission::check_permission(&state.db, &user.id, &dataset_id, PermissionType::Read)?;
    }

    let feature = dataset
        .get_feature(&state.data_db, feature_id, &user, format_param.format)
        .await?;

    Ok(HttpResponse::Ok().body(feature))
}

#[put("{dataset_id}/data/{feature_id}")]
async fn update_feature(
    state: web::Data<State>,
    Path((dataset_id, feature_id)): Path<(Uuid, String)>,
    web::Json(update): web::Json<serde_json::Value>,
    web::Query(format_param): web::Query<FormatParam>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {

    let dataset = Dataset::find(&state.db, dataset_id)?;
    let user = User::from_token(&state.db, &logged_in_user.user);

    if let Some(user) = logged_in_user.user {
        Permission::check_permission(&state.db, &user.id, &dataset.id, PermissionType::Write)?;
    }

    let result = dataset
        .update_feature(&state.data_db, feature_id, &user, update, format_param.format)
        .await?;

    Ok(HttpResponse::Ok().body(result))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_data_query);
    cfg.service(get_data_query_csv);
    cfg.service(get_feature);
    cfg.service(get_data);
    cfg.service(update_feature);
}
