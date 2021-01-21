use crate::models::User;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::schema::datasets::{self, dsl::*};

#[derive(Serialize, Deserialize)]
pub struct DatasetSearch {
    name: Option<String>,
    live: Option<bool>,
    date_start: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDatasetDTO {
    name: String,
    sync_url: Option<String>,
    sync_frequency_seconds: Option<i64>,
    post_import_script: Option<String>,
    public: bool,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Associations)]
#[belongs_to(parent = "User", foreign_key = "owner_id")]
#[table_name = "datasets"]
pub struct Dataset {
    pub id: Uuid,
    owner_id: Uuid,
    name: String,
    original_filename: String,
    original_type: String,
    sync_dataset: bool,
    sync_url: Option<String>,
    sync_frequency_seconds: Option<i64>,
    post_import_script: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

#[derive(Serialize, Deserialize)]
pub struct SyncDatasetDTO {
    name: String,
    description: String,
}

impl Dataset {
    pub fn search(pool: &DbPool, search: DatasetSearch) -> Result<Vec<Dataset>, ServiceError> {
        let conn = pool.get().unwrap();
        let results: Vec<Dataset> = datasets
            .get_results(&conn)
            .map_err(|e| ServiceError::InternalServerError("Failed to retrive datasets".into()))?;
        Ok(results)
        // Ok(datasets)
    }

    pub fn find(pool: &DbPool, dataset_id: Uuid) -> Result<Dataset, ServiceError> {
        let conn = pool.get().unwrap();
        let dataset = datasets::table
            .filter(datasets::id.eq(dataset_id))
            .first(&conn)
            .map_err(|e| ServiceError::DatasetNotFound)?;
        Ok(dataset)
    }
}
