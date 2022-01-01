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

    #[display(fmt = "Unauthorized")]
    Unauthorized(String),
    #[display(fmt = "Upload Failed")]
    UploadFailed,

    #[display(fmt = "Query Required")]
    QueryRequired,

    #[display(fmt = "DB config error")]
    DBConfigError(String),

    #[display(fmt = "API failed")]
    APIFailed(String),

    #[display(fmt = "Query failed")]
    QueryFailed(String),
}

// TODO refactor this at somepoint to make shorter and use the display strings
// more
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
            ServiceError::Unauthorized(reasion) => HttpResponse::Unauthorized().json(format!(
                "Your are not authorized to take that action. {}",
                reasion
            )),
            ServiceError::UploadFailed => {
                HttpResponse::InternalServerError().json("Your upload failed")
            }
            ServiceError::APIFailed(reason) => {
                HttpResponse::BadRequest().json(format!("API failed {}", reason))
            }
            ServiceError::QueryFailed(reason) => {
                HttpResponse::BadRequest().json(format!("Query failed {}", reason))
            }
            ServiceError::DBConfigError(reason) => {
                HttpResponse::InternalServerError().json(format!("Invalid DB Config {}", reason))
            }
            ServiceError::QueryRequired => HttpResponse::BadRequest().json(format!("{}", self)),
        }
    }
}
