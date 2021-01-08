use actix_web::{error::ResponseError, HttpResponse};
use derive_more::Display;


#[derive(Debug,Display)]
pub enum ServiceError{
    #[display(fmt = "Internal Server Error")]
    InternalServerError,

    #[display(fmt="Had Request:{}", _0)]
    BadRequest(String),

    #[display(fmt="JWKSFetchError")]
    JWKSFetchError
}

impl ResponseError for ServiceError{
    fn error_response(&self)-> HttpResponse{
        match self{
            ServiceError::InternalServerError=>{
                HttpResponse::InternalServerError().json("Internal Server Error, Please try again Later")
            }
            ServiceError::BadRequest(ref message)=> HttpResponse::BadRequest().json(message),
            ServiceError::JWKSFetchError=>{
                HttpResponse::InternalServerError().json("Could not fetch JWKS")
            }
        }
    }
}