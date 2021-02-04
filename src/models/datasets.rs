use crate::models::User;
use actix_web::web;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::sql_types::Text;
use log::info;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::schema::datasets::{self, dsl::*};
use crate::utils::PaginationParams;

#[derive(Serialize, Deserialize, QueryableByName, PartialEq, Debug)]
pub struct JsonQueryResult {
    #[sql_type = "Text"]
    res: String,
}

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
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDatasetDTO {
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "datasets"]
pub struct UpdateDatasetDTO{
    pub name: Option<String>,
    pub description: Option<String>,
    pub public: Option<bool>,
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

    pub fn delete(pool: &DbPool, dataset_id:Uuid)->Result<(), ServiceError>{
        let conn = pool.get().unwrap();
        diesel::delete(datasets::table.filter(datasets::id.eq(dataset_id))).execute(&conn).map_err(|_| ServiceError::BadRequest(format!("Failed to delete dataset {}",dataset_id)))?;
        Ok(())
    }

    pub async fn query(
        &self,
        pool: &DbPool,
        query: Option<String>,
        page: PaginationParams,
    ) -> Result<String, ServiceError> {
        let conn = pool.get().unwrap();

        let sub_query = match query {
            Some(q) => q,
            None => format!("select * from {name} {page}", name = self.name, page = page),
        };
        let full_query = format!(
            "with q as ( select * from  ({sub_query}) as a {page} ) select json_agg(q) as res from q",
            sub_query = sub_query,
            page = page
        );
        let full_query2 = full_query.clone();

        let result: Result<JsonQueryResult, ServiceError> =
            web::block(move || diesel::sql_query(&full_query).get_result(&conn))
                .await
                .map_err(|e| {
                    ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, full_query2))
                });
        Ok(result?.res)
    }

    pub fn update(pool:&DbPool, dataset_id: Uuid, updates: UpdateDatasetDTO)-> Result<Dataset,ServiceError>{
        let conn = pool.get().unwrap();
        let updated_dataset = diesel::update(datasets::table.filter(datasets::id.eq(dataset_id)))
        .set(updates)
        .get_result(&conn)
        .map_err(|e| ServiceError::BadRequest(format!("Failed to update dataset {} {}", dataset_id, e)))?;
        
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
}
