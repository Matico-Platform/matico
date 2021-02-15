use crate::models::User;
use actix_web::web;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use log::{info, warn};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db::{DataDbPool, DbPool, PostgisQueryRunner};
use crate::errors::ServiceError;
use crate::models::columns::{Column, ColumnType};
use crate::schema::datasets::{self, dsl::*};
use crate::utils::PaginationParams;

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

#[derive(Debug, Serialize, Deserialize, Insertable, AsChangeset, Queryable, Associations)]
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
    pub description: String,
    pub geom_col: String,
    pub id_col: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDatasetDTO {
    pub name: String,
    pub description: String,
    pub geom_col: String,
    pub id_col: String,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "datasets"]
pub struct UpdateDatasetDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub public: Option<bool>,
    pub geom_col: Option<String>,
    pub id_col: Option<String>,
}

impl Dataset {
    pub fn search(pool: &DbPool, _search: DatasetSearch) -> Result<Vec<Dataset>, ServiceError> {
        //     let conn = pool.get().unwrap();
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

    pub fn delete(pool: &DbPool, dataset_id: Uuid) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::delete(datasets::table.filter(datasets::id.eq(dataset_id)))
            .execute(&conn)
            .map_err(|_| {
                ServiceError::BadRequest(format!("Failed to delete dataset {}", dataset_id))
            })?;
        Ok(())
    }

    pub async fn query(
        &self,
        pool: &DataDbPool,
        query: Option<String>,
        page: Option<PaginationParams>,
        format: Option<String>,
    ) -> Result<String, ServiceError> {
        let q = match query {
            Some(query) => query,
            None => format!("select * from {}", self.name),
        };

        let f = match format {
            Some(format) => format,
            None => "geojson".into(),
        };

        let result = PostgisQueryRunner::run_query(pool, &q, page, &f).await?;

        Ok(result.to_string())
    }

    pub fn update(
        pool: &DbPool,
        dataset_id: Uuid,
        updates: UpdateDatasetDTO,
    ) -> Result<Dataset, ServiceError> {
        let conn = pool.get().unwrap();
        let updated_dataset = diesel::update(datasets::table.filter(datasets::id.eq(dataset_id)))
            .set(updates)
            .get_result(&conn)
            .map_err(|e| {
                ServiceError::BadRequest(format!("Failed to update dataset {} {}", dataset_id, e))
            })?;
        Ok(updated_dataset)
    }

    pub fn create_or_update(&self, pool: &DbPool) -> Result<Dataset, ServiceError> {
        let conn = pool.get().unwrap();
        info!("attempting to save {:?}", self);

        diesel::insert_into(datasets)
            .values(self)
            .on_conflict(datasets::id)
            .do_update()
            .set(self)
            .get_result(&conn)
            .map_err(|e| {
                ServiceError::BadRequest(format!("Failed to create or update dataset, {}", e))
            })
    }

    pub async fn update_feature(
        &self,
        pool: &DbPool,
        feature_id: String,
        update: serde_json::Value,
    ) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        let obj = update.as_object().unwrap();
        let mut key_vals: Vec<String> = vec![];

        for (key, value) in &*obj {
            info!("{} : {}", key, value);
            // TODO FIX THIS!
            key_vals.push(format!("{} = {}", key, value).replace("\"", "'"));
        }
        let set_statement = key_vals.join(",");
        let query = format!(
            "
        UPDATE {}
        SET {}
        WHERE {} = {}",
            self.name, set_statement, self.id_col, feature_id
        );
        info!("Update query is {}", query.clone());
        let query2 = query.clone();
        web::block(move || diesel::sql_query(&query).execute(&conn))
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, query2);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, query2))
            })?;
        Ok(())
    }

    pub fn columns(&self) -> Vec<Column> {
        vec![]
    }
}
