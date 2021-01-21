use actix_web::{error::ResponseError, HttpResponse};
use derive_more::Display;

#[derive(Debug, Display)]
pub enum ServiceError {
    #[display(fmt = "Internal Server Error")]
    InternalServerError(String),

    #[display(fmt = "Had Request:{}", _0)]
    BadRequest(String),

    #[display(fmt = "Signup Failed")]
    SignUpFailed(String),

    #[display(fmt = "User Not found Error")]
    UserNotFound,

    #[display(fmt = "Dataset Not found Error")]
    DatasetNotFound,

    #[display(fmt = "JWKSFetchError")]
    JWKSFetchError,

    #[display(fmt = "Invalid Token")]
    InvalidToken,
}

impl ResponseError for ServiceError {
    fn error_response(&self) -> HttpResponse {
        match self {
            ServiceError::InternalServerError(message) => {
                HttpResponse::InternalServerError().json(message)
            }
            ServiceError::BadRequest(ref message) => HttpResponse::BadRequest().json(message),
            ServiceError::JWKSFetchError => {
                HttpResponse::InternalServerError().json("Could not fetch JWKS")
            }
            ServiceError::UserNotFound => HttpResponse::NotFound().json("User could not be found"),
            ServiceError::DatasetNotFound => {
                HttpResponse::NotFound().json("Dataset could not be found")
            }
            ServiceError::SignUpFailed(failed_reason) => {
                HttpResponse::BadRequest().json(failed_reason)
            }
            ServiceError::InvalidToken => HttpResponse::Unauthorized().json("Invalid Token"),
        }
    }
}
