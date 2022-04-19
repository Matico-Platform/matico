use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::{Dataset, User};
use crate::schema::sync_imports::{self, dsl::*};
use crate::utils::geo_file_utils::load_dataset_to_db;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
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
        let query = sync_imports::table.into_boxed();

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|_| {
            ServiceError::InternalServerError("Failed to retrive SyncImports".into())
        })?;
        Ok(results)
        // Ok(datasets)
    }

    pub fn for_dataset(
        pool: &DbPool,
        query_dataset_id: &Uuid,
    ) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let query = sync_imports::table
            .filter(dataset_id.eq(query_dataset_id))
            .order(scheduled_for.desc());

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|_| {
            ServiceError::InternalServerError(format!(
                "Failed to retrive SyncImports for dataset {}",
                query_dataset_id
            ))
        })?;
        Ok(results)
    }

    pub fn active_for_dataset(
        pool: &DbPool,
        query_dataset_id: &Uuid,
    ) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let query = sync_imports::table
            .filter(dataset_id.eq(query_dataset_id).and(status.eq_any(vec![
                SyncImportStatus::InProgress,
                SyncImportStatus::Pending,
            ])))
            .order(scheduled_for.desc());

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|e| {
            ServiceError::InternalServerError(format!(
                "Failed to get active datasets for {} : {}",
                query_dataset_id, e
            ))
        })?;
        Ok(results)
    }

    pub fn for_user(pool: &DbPool, query_user_id: &Uuid) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let query = sync_imports::table
            .filter(user_id.eq(query_user_id))
            .order(scheduled_for.desc());

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|e| {
            ServiceError::InternalServerError(format!(
                "Failed to retrive SyncImports for user {}: {}",
                query_user_id, e
            ))
        })?;
        Ok(results)
    }

    pub fn start_for_dataset(pool: &DbPool, dataset: &Dataset) -> Result<(), ServiceError> {
        if !dataset.sync_dataset {
            return Err(ServiceError::InternalServerError(format!(
                "Attempted to create an import sync for non sync dataset {:?}",
                dataset
            )));
        }

        let conn = pool.get().unwrap();
        let run_at = Utc::now().naive_utc();

        diesel::insert_into(sync_imports)
            .values((
                sync_imports::dataset_id.eq(dataset.id),
                sync_imports::user_id.eq(dataset.owner_id),
                sync_imports::status.eq(SyncImportStatus::Pending),
                sync_imports::scheduled_for.eq(run_at),
            ))
            .execute(&conn)
            .map_err(|_| {
                ServiceError::InternalServerError(format!(
                    "Failed to create inital sync for dataset {:?}",
                    dataset
                ))
            })?;
        Ok(())
    }

    pub fn active_for_user(
        pool: &DbPool,
        query_user_id: &Uuid,
    ) -> Result<Vec<SyncImport>, ServiceError> {
        let conn = pool.get().unwrap();
        let query = sync_imports::table
            .filter(user_id.eq(query_user_id).and(status.eq_any(vec![
                SyncImportStatus::InProgress,
                SyncImportStatus::Pending,
            ])))
            .order(scheduled_for.desc());

        let results: Vec<SyncImport> = query.get_results(&conn).map_err(|e| {
            ServiceError::InternalServerError(format!(
                "Failed to retrive SyncImports for user {}: {}",
                query_user_id, e
            ))
        })?;
        Ok(results)
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

    pub async fn download_file(url: &str) -> Result<(File, String), ServiceError> {
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

            tracing::info!("file to download: '{}'", fname);
            let fname = tmp_dir.join(fname);
            tracing::info!("will be located under: '{:?}'", fname);
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
        Ok((dest, String::from(filename.to_str().unwrap())))
    }

    pub async fn process(&self, pool: &DbPool, ogr_string: String) -> Result<(), ServiceError> {
        match self.attempt_process(pool, ogr_string).await {
            Ok(next_run_time) => {
                self.schedule_next(pool, next_run_time)?;
                self.set_done(pool)?;
            }
            Err(err) => {
                self.set_failed(pool, err)?;
            }
        };
        Ok(())
    }

    pub fn schedule_next(
        &self,
        pool: &DbPool,
        run_at: chrono::NaiveDateTime,
    ) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();

        diesel::insert_into(sync_imports)
            .values((
                sync_imports::dataset_id.eq(self.dataset_id),
                sync_imports::user_id.eq(self.user_id),
                sync_imports::status.eq(SyncImportStatus::Pending),
                sync_imports::scheduled_for.eq(run_at),
            ))
            .execute(&conn)
            .map_err(|_| {
                ServiceError::InternalServerError(format!(
                    "Failed to create next sync request {:?}",
                    self
                ))
            })?;
        Ok(())
    }

    pub async fn attempt_process(
        &self,
        pool: &DbPool,
        ogr_string: String,
    ) -> Result<chrono::NaiveDateTime, ServiceError> {
        self.start_processing(pool)?;
        let dataset = Dataset::find(pool, self.dataset_id)?;

        tracing::info!("Starting to download dataset {:?} ", dataset);
        let (_file, filepath) = Self::download_file(&dataset.sync_url.unwrap()).await?;
        println!("file downloaded {:?} ", filepath);

        load_dataset_to_db(
            filepath.clone(),
            dataset.table_name.clone(),
            dataset.import_params.clone(),
            ogr_string,
        )
        .await?;
        let next_time =
            self.scheduled_for + chrono::Duration::seconds(dataset.sync_frequency_seconds.unwrap());

        Ok(next_time)
    }
    pub fn set_failed(&self, pool: &DbPool, err: ServiceError) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::update(self)
            .set((
                status.eq(SyncImportStatus::Error),
                error.eq(format!("{}", err)),
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
        let query = sync_imports::table.filter(
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
