use actix_web::{get, web, HttpResponse};
use glob::glob;
use serde::Serialize;
use crate::errors::ServiceError;
use std::env::current_dir;

#[derive(Serialize)]
struct ComputeDetails{
    name: String,
    path: String 
}

fn to_url_path(path: &str)->&str{
    path.split("compute").last().unwrap()
}

/// This is currently a quick way of doing compute nodes 
/// should replace with a database record at some point
#[get("")]
async fn list_analysis(
) -> Result<HttpResponse,ServiceError>{
    let search_path = format!("{}/static/compute/**/*.js",current_dir().unwrap().display());
    
    println!("Searching for compute in {}",search_path);
    let paths = glob(&search_path)
        .expect("The compute directory to exist");
    let computes: Vec<ComputeDetails>  = paths.filter_map(|path| 

    path.ok().map(|p| ComputeDetails{
        name: p.file_name().unwrap().to_string_lossy().to_string(),
        path: to_url_path(&p.to_string_lossy().to_string()).to_string()
    } )
    ).collect();
    Ok(HttpResponse::Ok().json(computes))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(list_analysis);
}
