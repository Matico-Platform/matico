#[macro_use]
extern crate diesel;
extern crate argon2;

use crate::app_state::State;
use actix_cors::Cors;
use actix_files as fs;
use actix_web::{middleware, web, App, HttpServer};
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;
use std::path::PathBuf;

mod app_config;
mod app_state;
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
    dotenv().ok();
    let config = app_config::Config::from_conf().unwrap();
    let db_connection_url = config.connection_string().unwrap();
    let manager = ConnectionManager::<diesel::pg::PgConnection>::new(db_connection_url);
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let config = Config::from_conf().unwrap();
    let listener = TcpListener::bind(&config.server_addr).expect("Failed to bind to address");
    println!("Server runnning at {}", &config.server_addr);
    run(listener, config).await?.await
}
