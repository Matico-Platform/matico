#[macro_use]
extern crate diesel;

use actix_web::{web,App,HttpServer,Responder, middleware};
use diesel::r2d2::{self,ConnectionManager};

mod routes;
mod app_config;
mod db;
mod tiler;

async fn home()->impl Responder{
    format!("Hey buddy!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = app_config::Config::from_conf().unwrap();
    let manager = ConnectionManager::<diesel::pg::PgConnection>::new(config.db_string);
    let pool = r2d2::Pool::builder()
    .build(manager)
    .expect("Failed to connect to DB");
    
    let server = HttpServer::new(move ||{
        App::new()
        .data(pool.clone())
        .wrap(middleware::Logger::default())
        .route("/",web::get().to(home))
        .route("/tile/{z}/{x}/{y}", web::get().to(tiler::get_tile))
        .route("/upload",web::post().to(routes::upload::upload_geo_file))
        .route("/upload",web::get().to(routes::upload::simple_upload_form))
    })
    .bind(config.server_addr.clone())?
    .run();
    println!("Server running at http://{}/", config.server_addr);
    server.await
}
