#[macro_use]
extern crate diesel;
extern crate argon2;

use actix_cors::Cors;
use actix_files as fs;
use actix_web::{middleware, web, App, HttpServer};
use diesel::r2d2::{self, ConnectionManager};
use std::path::PathBuf;

mod app_config;
mod auth;
mod db;
mod errors;
mod models;
mod routes;
mod schema;
mod tiler;
mod utils;

async fn home() -> std::io::Result<fs::NamedFile> {
    let path: PathBuf = "./static/index.html".parse().unwrap();
    Ok(fs::NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
            .service(web::scope("/tiler").configure(tiler::init_routes))
            .service(web::scope("/users").configure(routes::users::init_routes))
            .service(web::scope("/auth").configure(routes::auth::init_routes))
            .service(web::scope("/datasets").configure(routes::datasets::init_routes))
            .service(fs::Files::new("/", "static").show_files_listing())
    })
    .bind(config.server_addr.clone())?
    .run();
    println!("Server running at http://{}/", config.server_addr);
    server.await
}
