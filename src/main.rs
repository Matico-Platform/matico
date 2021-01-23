#[macro_use]
extern crate diesel;

extern crate argon2;

use actix_cors::Cors;
use actix_web::dev::ServiceRequest;
use actix_web::middleware::Logger;
use actix_web::{http, middleware, web, App, Error, HttpServer, Responder};
use actix_web_httpauth::extractors::{
    bearer::{BearerAuth, Config},
    AuthenticationError,
};
use actix_web_httpauth::middleware::HttpAuthentication;
use diesel::r2d2::{self, ConnectionManager};

mod app_config;
mod auth;
mod db;
mod errors;
mod models;
mod routes;
mod schema;
mod tiler;
mod utils;

async fn home() -> impl Responder {
    format!("Hey buddy!")
}

// async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, Error> {
//     return Ok(req);
//     println!("VALIDATING");
//     let config = req
//         .app_data::<Config>()
//         .map(|data| data.clone())
//         .unwrap_or_else(Default::default);

//     match auth::validate_token(credentials.token()) {
//         Ok(res) => {
//             if res == true {
//                 Ok(req)
//             } else {
//                 Err(AuthenticationError::from(config).into())
//             }
//         }
//         Err(_) => Err(AuthenticationError::from(config).into()),
//     }
// }

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // std::env::set_var("RUST_BACKTRACE", "1");
    let config = app_config::Config::from_conf().unwrap();
    let manager = ConnectionManager::<diesel::pg::PgConnection>::new(config.db_string);
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to connect to DB");

    let server = HttpServer::new(move || {
        // let auth = HttpAuthentication::bearer(validator);
        let cors = Cors::default()
            .allow_any_header()
            .allow_any_origin()
            .allow_any_method();

        App::new()
            .wrap(cors)
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .wrap(middleware::Logger::new("%{Content-Type}i"))
            .route("/", web::get().to(home))
            .service(web::scope("/tile").configure(tiler::init_routes))
            .service(web::scope("/users").configure(routes::users::init_routes))
            .service(web::scope("/auth").configure(routes::auth::init_routes))
            .service(web::scope("/datasets").configure(routes::datasets::init_routes))
    })
    .bind(config.server_addr.clone())?
    .run();
    println!("Server running at http://{}/", config.server_addr);
    server.await
}
