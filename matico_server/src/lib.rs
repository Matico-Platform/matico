#[macro_use]
extern crate diesel;
extern crate argon2;
extern crate diesel_derive_enum;

#[macro_use]
extern crate diesel_migrations;
use crate::app_state::State;
use actix::*;
use actix_cors::Cors;
use actix_files as fs;
use actix_web::{dev::Server, Responder};
use actix_web::{middleware, web, App, HttpServer};
use diesel::r2d2::{self, ConnectionManager};
use log::{info};
use scheduler::ImportScheduler;
use sqlx::postgres::PgPoolOptions;
use std::net::TcpListener;

use std::time::Duration;

pub mod app_config;
mod app_state;
mod auth;
mod db;
mod errors;
mod models;
mod routes;
mod scheduler;
mod schema;
mod tiler;
mod utils;

pub async fn health() -> impl Responder {
    "Everything is fine".to_string()
}

pub async fn run(
    listener: TcpListener,
    config: app_config::Config,
) -> Result<Server, std::io::Error> {
    println!("config is {:?}", config);
    let db_connection_url = config.connection_string().unwrap();
    println!("Connecting to : {}", db_connection_url);
    let manager = ConnectionManager::<diesel::pg::PgConnection>::new(db_connection_url);

    // Set up the database pool for the system metadata
    info!("Connecting to metadata db");
    let pool = r2d2::Pool::builder()
        .max_size(10)
        .build(manager)
        .expect("Failed to connect to DB");
    info!("Connected to metadata db");

    info!("Running migrations");
    db::run_migrations(&pool);
    info!("Migrated succestully");

    let data_db_connection_url = config.data_connection_string().unwrap();
    let data_pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&data_db_connection_url)
        .await
        .expect("FAiled to connect to DB");

    let sync_pool = pool.clone();
    let _addr = ImportScheduler::create(|_| ImportScheduler {
        db: sync_pool,
        interval: Duration::new(10, 0),
    });

    let server = HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_header()
            .allow_any_origin()
            .allow_any_method();

        App::new()
            .wrap(cors)
            .data(State {
                db: pool.clone(),
                data_db: data_pool.clone(),
            })
            .wrap(middleware::Logger::default())
            .wrap(middleware::Logger::new("%{Content-Type}i"))
            .route("/api/health", web::get().to(health))
            .service(web::scope("/api/tiler").configure(tiler::init_routes))
            .service(web::scope("/api/users").configure(routes::users::init_routes))
            .service(web::scope("/api/auth").configure(routes::auth::init_routes))
            .service(web::scope("/api/apis").configure(routes::apis::init_routes))
            .service(web::scope("/api/apps").configure(routes::apps::init_routes))
            .service(
                web::scope("/api/datasets")
                    .configure(routes::data::init_routes)
                    .configure(routes::columns::init_routes)
                    .configure(routes::datasets::init_routes),
            )
            .service(fs::Files::new("/", "static").index_file("index.html"))
    })
    .listen(listener)?
    .run();

    Ok(server)
}
