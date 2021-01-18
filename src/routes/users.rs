use crate::db::DbPool;
use actix_web::{web, get,post,Error, HttpResponse};
use crate::models::User;
use serde::{Serialize,Deserialize};
use crate::auth::AuthService;
use crate::errors::ServiceError;

use uuid::Uuid;

#[derive(Debug,Serialize,Deserialize)]
pub struct InputUser{
    username: String,
    password: String
}

#[get("/profile")]
async fn profile(auth_user : AuthService)->Result<HttpResponse,ServiceError>{
    match auth_user.user{
        Some(u)=> Ok(HttpResponse::Ok().json(u)),
        None=> Err(ServiceError::UserNotFound)
    }
}

#[get("/{id}")]
async fn get_user(
    db: web::Data<DbPool>,
    user_id: web::Path<Uuid>
) -> Result<HttpResponse, Error>{
    let user = User::find_by_id(db.get_ref(), user_id.into_inner())?;
    Ok(HttpResponse::Found().json(user))
}



pub fn init_routes(cfg: &mut web::ServiceConfig){
    cfg.service(profile);
    cfg.service(get_user);
}