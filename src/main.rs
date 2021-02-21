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
use rustls::ClientConfig as RustlsClientConfig;
use tokio_postgres_rustls::MakeRustlsConnect;
use std::fs::File;
use std::io::BufReader;

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

    // Set up the database pool for the system metadata
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to connect to DB");

    // Set up the database pool for the data database
    println!("DB POOL CONFIG {:?}", config.datadb);
    let data_pool = if let Some(cert_path) = config.cert_path{
        let mut tls_config = RustlsClientConfig::new();
        let cert_file = File::open(&cert_path)?;
        let mut buf = BufReader::new(cert_file);
        println!("buff {:?}", buf);
        tls_config.root_store.add_pem_file(&mut buf).expect("Failed to add cert file");
        let tls = MakeRustlsConnect::new(tls_config);
        config.datadb.create_pool(tls)
    }
    else{
        config.datadb.create_pool(tokio_postgres::NoTls)
    }.expect("failed to connect to data db");
    // let data_pool = deadpool_postgres::Pool::new(manager, 10);

    // Create app state

    // let app_state = State {
    //     db: pool.clone(),
    //     data_db: data_pool,
    // };

    let server = HttpServer::new(move || {
        // let auth = HttpAuthentication::bearer(validator);
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
            // .wrap(middleware::NormalizePath::default())
            .service(web::scope("/api/tiler").configure(tiler::init_routes))
            .service(web::scope("/api/users").configure(routes::users::init_routes))
            .service(web::scope("/api/auth").configure(routes::auth::init_routes))
            .service(web::scope("/api/queries").configure(routes::queries::init_routes))
            .service(web::scope("/api/dashboards").configure(routes::dashboards::init_routes))
            .service(
                web::scope("/api/datasets")
                    .configure(routes::data::init_routes)
                    .configure(routes::columns::init_routes)
                    .configure(routes::datasets::init_routes),
            )
            .service(fs::Files::new("/", "static").index_file("index.html"))
            .default_service(web::get().to(home))
    })
    .bind(config.server_addr.clone())?
    .run();

    println!("Server running at http://{}/", config.server_addr);
    server.await
}
