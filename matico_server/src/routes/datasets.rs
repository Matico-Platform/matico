use crate::app_state::State;
use crate::auth::AuthService;
use crate::errors::ServiceError;
use crate::models::permissions::*;
use crate::utils::geo_file_utils::{get_file_info, load_dataset_to_db};

use crate::models::{
    datasets::{CreateDatasetDTO, CreateSyncDatasetDTO, Dataset, UpdateDatasetDTO},
    DatasetSearch, UserToken,
};
use actix_multipart::{Field, Multipart};
use actix_web::{delete, get, guard, put, web, Error, HttpResponse};
use chrono::Utc;
use futures::{StreamExt, TryStreamExt};
use log::{info, warn};
use std::io::Write;
use uuid::Uuid;
use slugify::slugify;

#[get("")]
async fn get_datasets(
    state: web::Data<State>,
    web::Query(search_criteria): web::Query<DatasetSearch>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let mut search = search_criteria.clone();

    // If no user_id is specified in the query and there is
    // a logged in user then we will grab that user
    // If there is no logged in user, we will return only
    // public datasets
    if let Some(user) = logged_in_user.user {
        if search.user_id == None {
            search.user_id = Some(user.id);
        }
    } else {
        search.public = Some(true)
    };

    let datasets = Dataset::search(&state.db, search)?;
    Ok(HttpResponse::Ok().json(datasets))
}

#[get("/{id}")]
async fn get_dataset(
    state: web::Data<State>,
    id: web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let dataset = Dataset::find(&state.db, id.into_inner())?;

    if let Some(user) = logged_in_user.user {
        if !dataset.public && user.id != dataset.owner_id {
            Permission::require_permissions(
                &state.db,
                &user.id,
                &dataset.id,
                &vec![PermissionType::READ],
            )?;
        }
    }
    Ok(HttpResponse::Ok().json(dataset))
}

async fn upload_dataset_to_tmp_file(mut field: Field, filename: &str) -> Result<String, Error> {
    let filepath = format!("./tmp{}", sanitize_filename::sanitize(filename));
    let mut file = web::block(move || {
        std::fs::create_dir_all("./tmp").expect("was unable to create dir");
        std::fs::File::create(&filepath)
    })
    .await
    .unwrap();

    while let Some(chunk) = field.next().await {
        let data = chunk.unwrap();
        file = web::block(move || file.write_all(&data).map(|_| file)).await?;
    }
    //TODO Fix this
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
    state: web::Data<State>,
    mut payload: Multipart,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user: UserToken = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;

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
    let table_name = slugify!(&metadata.name.clone(),separator = "_");

    let file_info = get_file_info(&filepath)
        .map_err(|_| ServiceError::BadRequest("Failed to extract column info from file".into()))?;

    //Figure out how to not need this clone
    load_dataset_to_db(filepath.clone(), table_name.clone()).await?;

    //TODO Refactor this
    let dataset = Dataset {
        id: Uuid::new_v4(),
        owner_id: user.id,
        name: metadata.name.clone(),
        table_name:table_name,
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

    dataset.create_or_update(&state.db)?;

    Permission::grant_permissions(
        &state.db,
        user.id,
        dataset.id,
        ResourceType::DATASET,
        vec![
            PermissionType::READ,
            PermissionType::WRITE,
            PermissionType::ADMIN,
        ],
    )?;

    Ok(HttpResponse::Ok().json(file_info))
}

// This maps to "/" when content type is application/json
async fn create_sync_dataset(
    _state: web::Data<State>,
    _logged_in_user: AuthService,
    _sync_details: web::Json<CreateSyncDatasetDTO>,
) -> Result<HttpResponse, ServiceError> {
    println!("HITTING SYNC ENDPOINT");
    Ok(HttpResponse::Ok().json("SYNC ENDPOINT"))
}

#[put("{id}")]
async fn update_dataset(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
    web::Json(updates): web::Json<UpdateDatasetDTO>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;
    Permission::check_permission(&state.db, &user.id, &id, PermissionType::WRITE)?;

    let result = Dataset::update(&state.db, id, updates)?;
    Ok(HttpResponse::Ok().json(result))
}

#[delete("{id}")]
async fn delete_dataset(
    state: web::Data<State>,
    web::Path(id): web::Path<Uuid>,
    logged_in_user: AuthService,
) -> Result<HttpResponse, ServiceError> {
    let user = logged_in_user
        .user
        .ok_or(ServiceError::Unauthorized("No user logged in".into()))?;
    Permission::check_permission(&state.db, &user.id, &id, PermissionType::ADMIN)?;

    Dataset::delete(&state.db, id)?;
    Ok(HttpResponse::Ok().json(format!("Deleted dataset {}", id)))
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
