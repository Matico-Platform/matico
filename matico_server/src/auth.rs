use crate::errors::ServiceError;
use crate::models::UserToken;
use actix_web::{dev::Payload, FromRequest, HttpRequest};
use futures::future::{err, ok, Ready};
use jsonwebtoken::{decode, DecodingKey};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    company: String,
    exp: usize,
}

pub fn validate_token(token: &str) -> Result<UserToken, ServiceError> {
    let t = decode::<UserToken>(
        token,
        &DecodingKey::from_secret("secret".as_ref()),
        &jsonwebtoken::Validation::default(),
    )
    .map_err(|_e| ServiceError::InvalidToken)?;
    Ok(t.claims)
}

// Extracts the token from the request
fn extract_token_from_req(req: &HttpRequest) -> Option<&str> {
    let auth = req.headers().get("Authorization");
    match auth {
        Some(auth_str) => {
            let auth_str = auth_str.to_str().unwrap();
            if auth_str.contains("Bearer") {
                let parts: Vec<&str> = auth_str.split("Bearer").collect();
                Some(parts[1].trim())
            } else {
                None
            }
        }
        None => None,
    }
}

#[derive(Debug)]
pub struct AuthService {
    pub user: Option<UserToken>,
}

impl FromRequest for AuthService {
    type Error = actix_web::Error;
    type Future = Ready<Result<AuthService, actix_web::Error>>;
    // type Config = ();

    fn from_request(req: &HttpRequest, _payload: &mut Payload) -> Self::Future {
        let token = extract_token_from_req(req);
        match token {
            Some(_) => {
                let valid = validate_token(token.unwrap());
                match valid {
                    Ok(token) => ok(AuthService { user: Some(token) }),
                    Err(e) => err(e.into()),
                }
            }
            None => ok(AuthService { user: None }),
        }
    }
}
