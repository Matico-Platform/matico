use crate::errors::ServiceError;
use serde::{Deserialize,Serialize};
use alcoholic_jwt::{token_kid, validate, Validation, JWKS};
use std::error::Error;
use std::str::FromStr;
use actix_web::{FromRequest, HttpRequest,dev::Payload, error::ErrorUnauthorized};
use futures::future::{err,ok,Ready};
use alcoholic_jwt::{}
#[derive(Debug,Serialize,Deserialize)]
struct Claims{
    sub:String,
    company:String,
    exp: usize
}

pub fn validate_token(token:&str)-> Result<bool,ServiceError>{
    let authority = std::env::var("AUTHORITY").expect("AUTHORITY must be set");
    let jwks = fetch_jwks(&format!("{}{}", authority.as_str(), ".well-known/jwks.json"))
    .expect("failed to fetch jwks");

    let validations = vec![Validation::Issuer(authority), Validation::SubjectPresent];
    let kid  = match token_kid(&token){
        Ok(res)=> res.expect("Failed to decode kid"),
        Err(_)=>return Err(ServiceError::JWKSFetchError)
    };
    let jwk = jwks.find(&kid).expect("Specified key not found in set");
    let res = validate(token,jwk,validations);
    Ok(res.is_ok())
}

fn fetch_jwks(uri: &str)->Result<JWKS,Box<dyn Error>>{
    let mut res = reqwest::get(uri)?;
    let val = res.json::<JWKS>()?;
    Ok(val)
}

// Extracts the token from the request
fn extract_token_from_req(req: &HttpRequest)->Option<&str>{
    let auth = req.headers().get("Authorization");
    match auth{
        Some(auth_str)=>{
            let auth_str = auth_str.to_str().unwrap();
            if auth_str.contains("Bearer"){
                let parts: Vec<&str> = auth_str.split("Bearer").collect();
                Some(parts[1].trim())
            }
            else{
                None
            }
        },
        None => None 
    }
}

pub struct AuthService{
    pub user: Option<String>
}

impl FromStr for AuthService{
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err>{
        
    }
}

impl FromRequest for AuthService{
    type Error = actix_web::Error;
    type Future = Ready<Result<AuthService,actix_web::Error>>;
    type Config = ();

    fn from_request(req: &HttpRequest, _payload: &mut Payload)->Self::Future{
       let token = extract_token_from_req(req);
       match token{
           Some(t)=> ok(AuthService{user:Some(String::from(t))}),
           None => ok(AuthService{user:None}) 
       }
    }
}