use crate::auth::AuthService;
use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::utils::geo_file_utils::{get_file_info, load_dataset_to_db};

use crate::models::{datasets::{CreateDatasetDTO, UpdateDatasetDTO, CreateSyncDatasetDTO, Dataset}, DatasetSearch, UserToken};
use crate::utils::PaginationParams;
use actix_multipart::{Field, Multipart};
use actix_web::{get,put,guard,delete,web,Error,HttpResponse};
use chrono::Utc;
use futures::{StreamExt, TryStreamExt};
use log::{info, warn};
use std::io::Write;
use uuid::Uuid;


#[get("")]
async fn get_datasets(
    db: web::Data<DbPool>,
    search_criteria: web::Query<DatasetSearch>,
) -> Result<HttpResponse, ServiceError> {
    let datasets = Dataset::search(db.get_ref(), search_criteria.into_inner())?;
    Ok(HttpResponse::Ok().json(datasets))
}

#[get("/{id}")]
async fn get_dataset(
    db: web::Data<DbPool>,
    id: web::Path<Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(db.get_ref(), id.into_inner())?;
    Ok(HttpResponse::Ok().json(dataset))
}

async fn upload_dataset_to_tmp_file(mut field: Field, filename: &str) -> Result<String, Error> {
    let filepath = format!("./tmp{}", sanitize_filename::sanitize(filename));
    let mut file = web::block(move || {
        std::fs::create_dir_all("./tmp").expect("was unable to create dir");
        std::fs::File::create(&filepath.clone())
    })
    .await
    .unwrap();

    while let Some(chunk) = field.next().await {
        let data = chunk.unwrap();
        file = web::block(move || file.write_all(&data).map(|_| file)).await?;
    }
    let filepath = format!("./tmp{}", sanitize_filename::sanitize(filename));
    Ok(filepath)
}

async fn parse_dataset_metadata(mut field: Field) -> Result<CreateDatasetDTO, ServiceError> {
    info!("Parsing metadata");
    let field_content = field.next().await.unwrap().map_err(|_| {
        ServiceError::InternalServerError(String::from(
            "Failed to read metadata from mutlipart from",
        ))
    })?;

    let metadata_str = std::str::from_utf8(&field_content)
        .map_err(|_| ServiceError::InternalServerError("Failed to parse file metadata".into()))?;

    let metadata: CreateDatasetDTO = serde_json::from_str(metadata_str).map_err(|_| {
        ServiceError::BadRequest(String::from(
            "Failed to parse metadata, needs a name and description field",
        ))
    })?;
    info!("GOT METADATA AS STRING {:?}", metadata);
    Ok(metadata)
}

// This maps to "/" when content type is multipart/form-data
async fn create_dataset(
    db: web::Data<DbPool>,
    mut payload: Multipart,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user: UserToken = logged_in_user.user.ok_or(ServiceError::Unauthorized)?;

    let mut file: Option<String> = None;
    let mut metadata: Option<CreateDatasetDTO> = None;

    while let Ok(Some(field)) = payload.try_next().await {
        let content_type = field.content_disposition().unwrap();
        let name = content_type.get_name().unwrap();
        match name {
            "file" => {
                file = Some(
                    upload_dataset_to_tmp_file(field, &name)
                        .await
                        .map_err(|_| ServiceError::UploadFailed)?,
                );
                info!("Uploaded file");
            }
            "metadata" => {
                metadata = Some(parse_dataset_metadata(field).await?);
            }
            _ => warn!("Unexpected form type in upload"),
        }
    }

    let filepath = file.unwrap();
    let metadata = metadata.unwrap();
    let table_name = metadata.name.clone();

    let file_info = get_file_info(&filepath)
        .map_err(|_| ServiceError::BadRequest("Failed to extract column info from file".into()))?;

    //Figure out how to not need this clone
    load_dataset_to_db(filepath.clone(), table_name).await?;

    let dataset = Dataset {
        id: Uuid::new_v4(),
        owner_id: user.id,
        name: metadata.name.clone(),
        description: metadata.description,
        original_filename: filepath.clone(),
        original_type: "json".into(),
        sync_dataset: false,
        sync_url: None,
        sync_frequency_seconds: None,
        post_import_script: None,
        created_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        geom_col: metadata.geom_col,
        id_col: metadata.id_col,
        public: false,
    };

    dataset.create_or_update(db.get_ref())?;

    Ok(HttpResponse::Ok().json(file_info))
}

// This maps to "/" when content type is application/json
async fn create_sync_dataset(
    _db: web::Data<DbPool>,
    _logged_in_user: AuthService,
    _sync_details: web::Json<CreateSyncDatasetDTO>,
) -> Result<HttpResponse, ServiceError> {
    println!("HITTING SYNC ENDPOINT");
    Ok(HttpResponse::Ok().json("SYNC ENDPOINT"))
}

#[put("{id}")]
async fn update_dataset(
    db: web::Data<DbPool>,
    web::Path(id) : web::Path<Uuid>,
    web::Json(updates): web::Json<UpdateDatasetDTO>
) -> Result<HttpResponse, ServiceError>{
    let result = Dataset::update(db.get_ref(), id, updates)?;
    Ok(HttpResponse::Ok().json(result))
}

#[delete("{id}")]
async fn delete_dataset(
    db: web::Data<DbPool>,
    web::Path(id) : web::Path<Uuid>
)-> Result<HttpResponse,ServiceError>{
    Dataset::delete(db.get_ref(), id)?;
    Ok(HttpResponse::Ok().json(format!("Deleted dataset {}",id)))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(get_dataset);
    cfg.service(get_datasets);
    cfg.service(delete_dataset);
    cfg.service(update_dataset);
    cfg.service(
        web::resource("")
            .route(
                web::post()
                    .guard(guard::Header("content-type", "application/json"))
                    .to(create_sync_dataset),
            )
            .route(web::post().to(create_dataset)),
    );
}
