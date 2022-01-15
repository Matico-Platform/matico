use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::{Dataset, User};
use crate::schema::sync_imports::{self, dsl::*};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
use log::info;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use std::fs::File;
use std::io::copy;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, PartialEq, DbEnum)]
#[DieselType = "SyncImportStatusMapping"]
pub enum SyncImportStatus {
    Pending,
    Complete,
    Error,
    InProgress,
}

#[derive(
    Debug, Serialize, Deserialize, Insertable, Queryable, Identifiable, AsChangeset, Associations,
)]
#[belongs_to(parent = "Dataset", foreign_key = "dataset_id")]
#[belongs_to(parent = "User", foreign_key = "user_id")]
#[table_name = "sync_imports"]
pub struct SyncImport {
    pub id: Uuid,
    pub scheduled_for: NaiveDateTime,
    pub started_at: Option<NaiveDateTime>,
    pub finished_at: Option<NaiveDateTime>,
    pub status: SyncImportStatus,
    pub error: Option<String>,
    pub dataset_id: Uuid,
    pub user_id: Uuid,
}

impl SyncImport {
    pub fn all(pool: &DbPool) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let mut query = sync_imports::table.into_boxed();

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|_| {
            ServiceError::InternalServerError("Failed to retrive SyncImports".into())
        })?;
        Ok(results)
        // Ok(datasets)
    }

    pub fn start_processing(&self, pool: &DbPool) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::update(self)
            .set((
                status.eq(SyncImportStatus::InProgress),
                started_at.eq(Utc::now().naive_utc()),
            ))
            .execute(&conn)
            .map_err(|_| {
                ServiceError::InternalServerError(
                    "Failed to set processing status on sync import".into(),
                )
            })?;
        Ok(())
    }

    pub async fn download_file(url: &str) -> Result<File, ServiceError> {
        let tmp_dir = Path::new("./tmp/");
        let response = reqwest::get(url).await.map_err(|_| {
            ServiceError::BadRequest(format!("Failed to download dataset from url {}", url))
        })?;

        let (mut dest, filename) = {
            let fname = response
                .url()
                .path_segments()
                .and_then(|segments| segments.last())
                .and_then(|name| if name.is_empty() { None } else { Some(name) })
                .unwrap_or("tmp.bin");

            info!("file to download: '{}'", fname);
            let fname = tmp_dir.join(fname);
            info!("will be located under: '{:?}'", fname);
            let file = File::create(fname.clone()).map_err(|_| {
                ServiceError::InternalServerError("Failed to create file on dist".into())
            })?;
            (file, fname)
        };
        let content = response.text().await.map_err(|_| {
            ServiceError::InternalServerError("Failed to parse downloaded file".into())
        })?;
        copy(&mut content.as_bytes(), &mut dest)
            .map_err(|_| ServiceError::InternalServerError("Failed to save file to disk".into()))?;
        Ok(dest)
    }

    pub async fn process(&self, pool: &DbPool) -> Result<(), ServiceError> {
        self.start_processing(pool)?;
        info!("Starting to download dataset ");
        let file = Self::download_file(
            "https://data.cityofnewyork.us/api/geospatial/vfnx-vebw?method=export&format=GeoJSON",
        )
        .await?;
        println!("file downloaded ");
        self.set_done(pool)?;
        Ok(())
    }

    pub fn set_done(&self, pool: &DbPool) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::update(self)
            .set((
                status.eq(SyncImportStatus::Complete),
                finished_at.eq(Utc::now().naive_utc()),
            ))
            .execute(&conn)
            .map_err(|_| {
                ServiceError::InternalServerError(
                    "Failed to set processing status on sync import to complete".into(),
                )
            })?;
        Ok(())
    }

    pub fn pending(pool: &DbPool) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let mut query = sync_imports::table.filter(
            sync_imports::scheduled_for
                .lt(Utc::now().naive_utc())
                .and(sync_imports::status.eq(SyncImportStatus::Pending)),
        );

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|_| {
            ServiceError::InternalServerError("Failed to retrive SyncImports".into())
        })?;
        Ok(results)
    }
}
