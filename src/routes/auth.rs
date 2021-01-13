use actix_web::{get, post, HttpResponse, Error, web };
use jsonwebtoken::{encode,decode,Header,Algorithm,Validation,EncodingKey, DecodingKey};
use crate::models::{User,UserDTO};
use crate::db::DbPool;
use crate::errors::ServiceError;
use serde::{Deserialize,Serialize};


#[post("/login")]
async fn login(db: web::Data<DbPool>, login_details: web::Json<UserDTO>)->Result<HttpResponse,ServiceError>{
    let user = User::verify(db.get_ref() , login_details.into_inner())?;
    Ok(HttpResponse::Ok().json(user))
}

#[post("/signup")]
async fn register(db: web::Data<DbPool>, user: web::Json<UserDTO>)->Result<HttpResponse, ServiceError>{
    println!("HERE");
    let user = User::create(db.get_ref(), user.into_inner())?;
    Ok(HttpResponse::Ok().json(user))
}


pub fn init_routes(cfg: &mut web::ServiceConfig){
    cfg.service(register);
    cfg.service(login);
}