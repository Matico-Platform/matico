use crate::{app_state::State, auth::AuthService};
use crate::db::postgis_datasource::Bounds;
use crate::errors::ServiceError;
use crate::models::columns::StatParams;
use crate::models::{Dataset, User};
use serde::{Deserialize, Serialize};

use actix_web::{get, web, HttpResponse};
use actix_web_lab::extract::Path;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct ColumnStatRequest {
    pub stat: String,
    pub bounds: Option<Bounds>,
}

#[get("{dataset_id}/columns")]
async fn get_columns(
    state: web::Data<State>,
    Path(dataset_id): Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;
    let columns = dataset.columns(&state.data_db).await?;

    Ok(HttpResponse::Ok().json(columns))
}

#[get("{dataset_id}/columns/{column_name}/stats")]
async fn get_stats(
    state: web::Data<State>,
    Path((dataset_id, column_name)): Path<(Uuid, String)>,
    web::Query(request_details): web::Query<ColumnStatRequest>,
    logged_in_user : AuthService
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;
    let user  = User::from_token(&state.db, &logged_in_user.user);

    let stat_params: StatParams = serde_json::from_str(&request_details.stat).map_err(|e| {
        ServiceError::BadRequest(format!(
            "Stat request was miss-specification \n {} \n {}",
            request_details.stat, e
        ))
    })?;

    let col = dataset.get_column(&state.data_db, column_name).await?;
    let result = col.calc_stat(&state.data_db, &user, stat_params, None).await?;

    Ok(HttpResponse::Ok().json(result))
}

#[get("{dataset_id}/columns/{column_name}")]
async fn get_column(
    state: web::Data<State>,
    Path((dataset_id, column_name)): Path<(Uuid, String)>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, dataset_id)?;

    let col = dataset.get_column(&state.data_db, column_name).await?;

    Ok(HttpResponse::Ok().json(col))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_columns);
    cfg.service(get_column);
    cfg.service(get_stats);
}
