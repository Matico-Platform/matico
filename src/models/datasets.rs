use crate::models::User;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use std::default::Default;

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
pub struct CreateSyncDatasetDTO {
    name: String,
    sync_url: Option<String>,
    sync_frequency_seconds: Option<i64>,
    post_import_script: Option<String>,
    public: bool,
}

#[derive(Debug, Serialize, Deserialize,Insertable, AsChangeset, Queryable, Associations)]
#[belongs_to(parent = "User", foreign_key = "owner_id")]
#[table_name = "datasets"]
pub struct Dataset {
    pub id: Uuid,
    pub owner_id: Uuid,
    pub name: String,
    pub original_filename: String,
    pub original_type: String,
    pub sync_dataset: bool,
    pub sync_url: Option<String>,
    pub sync_frequency_seconds: Option<i64>,
    pub post_import_script: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
    pub description: String
}


#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDatasetDTO{
    pub name: String,
    pub description: String,
}

impl Dataset {
    pub fn search(pool: &DbPool, _search: DatasetSearch) -> Result<Vec<Dataset>, ServiceError> { //     let conn = pool.get().unwrap();
        let conn = pool.get().unwrap();
        let results: Vec<Dataset> = datasets
            .get_results(&conn)
            .map_err(|_| ServiceError::InternalServerError("Failed to retrive datasets".into()))?;
        Ok(results)
        // Ok(datasets)
    }

    pub fn find(pool: &DbPool, dataset_id: Uuid) -> Result<Dataset, ServiceError> {
        let conn = pool.get().unwrap();
        let dataset = datasets::table
            .filter(datasets::id.eq(dataset_id))
            .first(&conn)
            .map_err(|_| ServiceError::DatasetNotFound)?;
        Ok(dataset)
    }

    pub fn create_or_update(&self, pool: &DbPool)->Result<Dataset,ServiceError>{
        let conn = pool.get().unwrap();
        diesel::insert_into(datasets)
        .values(self)
        .on_conflict(datasets::id)
        .do_update()
        .set(self)
        .get_result(&conn)
        .map_err(|e| ServiceError::BadRequest("Failed to create or update dataset".into()))
    }
}
