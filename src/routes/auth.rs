use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::users::{LoginDTO, LoginResponseDTO, SignupDTO, SignupResponseDTO, User};
use actix_web::{post, web, HttpResponse};

#[post("/login")]
async fn login(
    db: web::Data<DbPool>,
    login_details: web::Json<LoginDTO>,
) -> Result<HttpResponse, ServiceError> {
    let user = User::verify(db.get_ref(), login_details.into_inner())?;
    let token = user.generate_token();

    Ok(HttpResponse::Ok().json(LoginResponseDTO { user, token }))
}

#[post("/signup")]
async fn register(
    db: web::Data<DbPool>,
    user: web::Json<SignupDTO>,
) -> Result<HttpResponse, ServiceError> {
    let user = User::create(db.get_ref(), user.into_inner())?;
    let token = user.generate_token();

    let response = SignupResponseDTO { user, token };
    Ok(HttpResponse::Created().json(response))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(register);
    cfg.service(login);
}
