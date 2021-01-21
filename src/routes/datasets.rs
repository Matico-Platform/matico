use crate::auth::AuthService;
use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::{CreateDatasetDTO, Dataset, DatasetSearch, SyncDatasetDTO};
use actix_multipart::Multipart;
use actix_web::{get, post, web, Error, HttpResponse};
use chrono::{NaiveDateTime, Utc};
use futures::{StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[get("")]
async fn get_datasets(
    db: web::Data<DbPool>,
    search_criteria: web::Query<DatasetSearch>,
) -> Result<HttpResponse, ServiceError> {
    let datasets = Dataset::search(db.get_ref(), search_criteria.into_inner())?;
    Ok(HttpResponse::Ok().json(datasets))
}

#[get("/:id")]
async fn get_dataset(
    db: web::Data<DbPool>,
    id: web::Query<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(db.get_ref(), id.into_inner())?;
    Ok(HttpResponse::Ok().json(dataset))
}

#[post("")]
async fn create_dataset(
    db: web::Data<DbPool>,
    mut payload: Multipart,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    println!("GOT THE REQUEST");

    match logged_in_user.user {
        Some(u) => println!("Got user {:?}", u),
        None => println!("NO logged in user"),
    }

    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_type = field.content_disposition().unwrap();
        let name = content_type.get_name().unwrap();
        println!("Content type name: {} deets: {}", name, content_type);
        match content_type.get_filename() {
            Some(f) => println!("File name is {}", f),
            None => println!("NO file name"),
        };
    }
    Ok(HttpResponse::Ok().json("Created"))
}

#[post("")]
async fn sync_dataset(
    db: web::Data<DbPool>,
    sync_details: web::Json<SyncDatasetDTO>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    println!("GOT THE SYNC REQUEST");

    match logged_in_user.user {
        Some(u) => println!("Got user {:?}", u),
        None => println!("NO logged in user"),
    }

    Ok(HttpResponse::Ok().json("Created"))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_datasets);
    cfg.service(get_dataset);
    cfg.service(create_dataset);
    cfg.service(sync_dataset);
}
