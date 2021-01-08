use crate::db::DbPool;
use crate::db::users;
use actix_web::{web, get,post,Error, HttpResponse};
use crate::models::{User,NewUser};
use serde::{Serialize,Deserialize};
use crate::auth::AuthService;

#[derive(Debug,Serialize,Deserialize)]
pub struct InputUser{
    username: String,
}
#[get("/restricted")]
async fn res(auth:AuthService)->HttpResponse{
    match auth.user{
        Some(user)=> HttpResponse::Ok().json(format!("got user {}",user)),
        None => HttpResponse::Ok().json("No user found")
    }
}

#[get("/{id}")]
async fn get_user(
    db: web::Data<DbPool>,
    user_id: web::Path<i32>
) -> Result<HttpResponse, Error>{
    Ok(
        web::block(move || users::get_user_by_id(db,user_id.into_inner()))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?
    )
}
#[post("/")]
async fn create_user(db: web::Data<DbPool>, input_user: web::Json<InputUser>)->Result<HttpResponse,Error>{
    Ok(
        web::block(move ||{
            let user = NewUser{
                username: &input_user.username,
                created_at: chrono::Local::now().naive_local()
            };
            users::create_user(db,&user)
        }).await
        .map(|user| HttpResponse::Created().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?
    )
}

pub fn init_routes(cfg: &mut web::ServiceConfig){
    cfg.service(res);
    cfg.service(create_user);
    cfg.service(get_user);
}