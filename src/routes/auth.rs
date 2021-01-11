use actix_web::{get, post, HttpResponse, Error, web };
use jsonwebtoken::{encode,decode,Header,Algorithm,Validation,EncodingKey, DecodingKey};
use crate::models::User;
use crate::db::DbPool;

struct LoginDTO{
    username: String,
    password: String
}

#[post("/login")]
async fn login(db: web::Data<DbPool>, login_details: web::Json<LoginDTO>)->HttpResponse{

    HttpResponse::Ok().json("Logged in")
}