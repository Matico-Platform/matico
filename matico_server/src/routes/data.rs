use std::collections::HashMap;
use std::str::FromStr;

use crate::app_state::State;
use crate::auth::AuthService;
use crate::db::{Bounds, DbPool, PostgisQueryBuilder, QueryBuilder, TilerOptions, TileID, QueryVal, QueryResult};
use crate::errors::ServiceError;
use crate::models::{Api, User, Dataset, permissions::*, StatParams};

use crate::utils::{Format, FormatParam, PaginationParams, SortParams};
use actix_web::{get, put, web, HttpResponse};
use actix_web_lab::extract::Path;

use derive_more::Display;
use log::info;
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize,Debug)]
struct QueryString{
    pub q:Option<String>
}

#[derive(Deserialize,Display)]
#[serde(rename_all="lowercase")]
enum SourceType{
    Dataset,
    Api,
    Query
}

impl FromStr for SourceType{
    type Err = ServiceError;
    fn from_str(input: &str)->Result<Self, Self::Err>{
        match input{
            "datasets"=> Ok(Self::Dataset),
            "apis"=> Ok(Self::Api),
            "query"=> Ok(Self::Query),
            _ => Err(ServiceError::InternalServerError("Only datasets, apis and queries valid as data sources".into()))
        }
    }
}



#[get("test")]
async fn test()->HttpResponse{
    HttpResponse::Ok().body(format!("{}", SourceType::Dataset))
}

async fn query_for_source(db: &DbPool, source_type_str: String, id: Option<Uuid>, query_str: Option<String>, query_params: HashMap<String, serde_json::Value> ) -> Result<PostgisQueryBuilder, ServiceError>{

    let mut query = PostgisQueryBuilder::new();
    let source_type: SourceType = SourceType::from_str(&source_type_str)?;

    info!("Getting data for {} {:#?} {:#?}", source_type, id, query_str);
    // TODO implement resource check

    match (source_type, id, query_str){
        (SourceType::Dataset, Some(id),None) => {
            let dataset = Dataset::find(db,id)?;
            query.dataset(dataset)
        },
        (SourceType::Api, Some(id), None) =>{
            let api = Api::find(db, id)?;
            query.api(api,query_params)
        },
        (SourceType::Query, None, Some(q))=>{
            query.query(q)
        },
        _ => return Err(ServiceError::InternalServerError("Either provide a Dataset or API with an ID or a query without one".into()))
    };

    Ok(query)
}

#[get("{source_type}/{source_id}/columns")]
async fn get_columns(
    state: web::Data<State>,
    Path((source_type_str, source_id)): Path<(String,Uuid)>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(query_str): web::Query<QueryString>,
    logged_in_user: AuthService,
    )->Result<HttpResponse, ServiceError>{

    let user  = User::from_token(&state.db, &logged_in_user.user);
    let mut query = query_for_source(&state.db, source_type_str, Some(source_id), query_str.q, query_params).await?;
    let columns = query.columns(&state.data_db).await?;
    Ok(HttpResponse::Ok().json(columns)) 
}

#[get("{source_type}/{source_id}/column/{column_name}")]
async fn get_column(
    state: web::Data<State>,
    Path((source_type_str, source_id, column_name)): Path<(String,Uuid,String)>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(query_str): web::Query<QueryString>,
    logged_in_user: AuthService,
    )->Result<HttpResponse, ServiceError>{

    let user  = User::from_token(&state.db, &logged_in_user.user);
    let mut query = query_for_source(&state.db, source_type_str, Some(source_id), query_str.q, query_params).await?;
    let columns = query.columns(&state.data_db).await?;
    let column = columns.iter().find(|c| c.name == column_name);

    Ok(HttpResponse::Ok().json(column)) 
}

#[get("{source_type}/{source_id}")]
async fn get_data(
    state: web::Data<State>,
    Path((source_type_str, source_id)): Path<(String,Option<Uuid>)>,
    web::Query(page): web::Query<PaginationParams>,
    web::Query(bounds): web::Query<Bounds>,
    web::Query(format_param): web::Query<FormatParam>,
    web::Query(sort): web::Query<SortParams>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(query_str): web::Query<QueryString>,
    logged_in_user: AuthService,
)->Result<HttpResponse, ServiceError>{

    let user  = User::from_token(&state.db, &logged_in_user.user);
    let mut query = query_for_source(&state.db, source_type_str, source_id, query_str.q, query_params).await?;
    query.page(page)
         .bounds(bounds)
         .sort(sort);

    let result = query.get_result(&state.data_db).await?;
    let format = format_param.format.unwrap_or_else(|| Format::Geojson );

    let result_str = result.as_format(&format)?;

    Ok(HttpResponse::Ok().content_type(format.mime_type()).body(result_str))
}

#[get("{source_type}/{source_id}/tiles/{z}/{x}/{y}")]
async fn get_tile(
    state: web::Data<State>,
    Path((source_type_str, source_id, tile_id)): Path<(String,Option<Uuid>, TileID)>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(query_str): web::Query<QueryString>,
    logged_in_user: AuthService,
)->Result<HttpResponse, ServiceError>{

    let user  = User::from_token(&state.db, &logged_in_user.user);
    let mut query = query_for_source(&state.db, source_type_str, source_id, query_str.q, query_params).await?;

    let result = query.get_tile(&state.data_db, TilerOptions::default(), tile_id).await?;
    Ok(HttpResponse::Ok().body(result.mvt))
}


#[get("{source_type}/{source_id}/feature/{feature_id}")]
async fn get_feature(
    state: web::Data<State>,
    Path((source_type_str, source_id, feature_id)): Path<(String, Option<Uuid>, QueryVal)>,
    web::Query(query_str): web::Query<QueryString>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(format_param): web::Query<FormatParam>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {

    let mut query = query_for_source(&state.db, source_type_str, source_id, query_str.q, query_params).await?;
    let user  = User::from_token(&state.db, &logged_in_user.user);

    let feature  = query.get_feature(&state.data_db, &feature_id, Some("ogc_id".into())).await?;

    let result  = QueryResult{
        result: vec![feature],
        execution_type:0
    };

    let format = format_param.format.unwrap_or(Format::Json);
    let result = result.as_format(&format)?;

    Ok(HttpResponse::Ok().content_type(format.mime_type()).body(result))
}

#[get("{source_type}/{source_id}/extent")]
async fn get_extent(
    state: web::Data<State>,
    Path((source_type_str, source_id, feature_id)): Path<(String, Option<Uuid>, QueryVal)>,
    web::Query(query_str): web::Query<QueryString>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {

    let mut query = query_for_source(&state.db, source_type_str, source_id, query_str.q, query_params).await?;
    let user  = User::from_token(&state.db, &logged_in_user.user);

    let extent= query.extent(&state.data_db, "wkb_geometry".into()).await?;

    Ok(HttpResponse::Ok().json(extent))
}


#[get("{source_type}/{source_id}/column/{column_name}/stat")]
async fn get_column_stat(
    state: web::Data<State>,
    Path((source_type_str, source_id, column_name)): Path<(String,Uuid,String)>,
    web::Query(query_params): web::Query<HashMap<String, serde_json::Value>>,
    web::Query(stat_params) : web::Query<StatParams>,
    web::Query(query_str): web::Query<QueryString>,
    logged_in_user: AuthService,
    )->Result<HttpResponse, ServiceError>{

    let user  = User::from_token(&state.db, &logged_in_user.user);
    let mut query = query_for_source(&state.db, source_type_str, Some(source_id), query_str.q, query_params).await?;
    let columns = query.columns(&state.data_db).await?;
    let column = columns.iter().find(|c| c.name == column_name).ok_or_else(|| ServiceError::InternalServerError(format!("invalid column {}",column_name)))?;
    let stat = query.get_stat_for_column(&state.data_db, &column, &stat_params ).await?;

    Ok(HttpResponse::Ok().json(stat)) 
}

// #[put("{dataset_id}/data/{feature_id}")]
// async fn update_feature(
//     state: web::Data<State>,
//     Path((dataset_id, feature_id)): Path<(Uuid, String)>,
//     web::Json(update): web::Json<serde_json::Value>,
//     web::Query(format_param): web::Query<FormatParam>,
//     logged_in_user: AuthService,
// ) -> Result<HttpResponse, ServiceError> {

//     let dataset = Dataset::find(&state.db, dataset_id)?;
//     let user = User::from_token(&state.db, &logged_in_user.user);

//     if let Some(user) = logged_in_user.user {
//         Permission::check_permission(&state.db, &user.id, &dataset.id, PermissionType::Write)?;
//     }

//     let result = dataset
//         .update_feature(&state.data_db, feature_id, &user, update, format_param.format)
//         .await?;

//     Ok(HttpResponse::Ok().body(result))
// }

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    // cfg.service(get_data_query);
    // cfg.service(get_data_query_csv);
    cfg.service(get_data);
    cfg.service(get_tile);
    cfg.service(get_columns);
    cfg.service(get_feature);
    cfg.service(get_extent);
    cfg.service(get_column_stat);
    cfg.service(test);
    // cfg.service(get_feature);
    // cfg.service(get_data);
    // cfg.service(update_feature);
}
