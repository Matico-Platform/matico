use crate::app_state::State;
use crate::auth::AuthService;
use crate::errors::ServiceError;
use crate::models::User;
use actix_web::{get, web, Error, HttpResponse};
use actix_web_lab::extract::Path;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct InputUser {
    username: String,
    password: String,
}

#[get("/profile")]
async fn profile(
    state: web::Data<State>,
    auth_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    match auth_user.user {
        Some(u) => {
            let user = User::find_by_id(&state.db, u.id)?;
            Ok(HttpResponse::Ok().json(user))
        }
        None => Err(ServiceError::UserNotFound),
    }
}

#[get("/{id}")]
async fn get_user(state: web::Data<State>, user_id: Path<Uuid>) -> Result<HttpResponse, Error> {
    let user = User::find_by_id(&state.db, user_id.into_inner())?;
    Ok(HttpResponse::Found().json(user))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(profile);
    cfg.service(get_user);
}
