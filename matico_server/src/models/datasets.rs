use crate::models::User;
use actix_web::web;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use log::{info, warn};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

use crate::db::{DataDbPool, DbPool, PostgisQueryRunner};
use crate::errors::ServiceError;
use crate::models::{columns::Column, Permission, PermissionType, ResourceType, SyncImport};
use crate::schema::datasets::{self, dsl::*};
use crate::utils::{Format, ImportParams, PaginationParams, SortParams};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DatasetSearch {
    pub name: Option<String>,
    pub public: Option<bool>,
    pub date_start: Option<NaiveDateTime>,
    pub user_id: Option<Uuid>,
    pub owner_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSyncDatasetDTO {
    pub name: String,
    pub description: String,
    pub sync_url: String,
    pub sync_frequency_seconds: i64,
    pub post_import_script: Option<String>,
    pub public: bool,
    pub import_params: ImportParams,
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
    pub table_name: String,
    pub import_params: ImportParams,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDatasetDTO {
    pub name: String,
    pub description: String,
    pub geom_col: String,
    pub id_col: String,
    pub import_params: ImportParams,
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
    pub fn search(pool: &DbPool, search: DatasetSearch) -> Result<Vec<Dataset>, ServiceError> {
        let conn = pool.get().unwrap();
        let mut query = datasets::table.into_boxed();

        // TODO This should be doable with a join but not sure how to handle many to many tables just
        // yet
        if let Some(user_id) = search.user_id {
            let datasets_the_user_has_permisions_for = Permission::get_permissions_for_user(
                pool,
                &user_id,
                Some(ResourceType::Dataset),
                Some(PermissionType::Read),
            )?;

            let datasets_the_user_has_permisions_for: Vec<Uuid> =
                datasets_the_user_has_permisions_for
                    .iter()
                    .map(|p| p.resource_id)
                    .collect();
            query = query.filter(
                datasets::id
                    .eq_any(datasets_the_user_has_permisions_for)
                    .or(datasets::public.eq(true)),
            );
        } else {
            query = query.filter(datasets::public.eq(true))
        }

        if let Some(dataset_owner_id) = search.owner_id {
            query = query.filter(datasets::owner_id.eq(dataset_owner_id));
        };

        let results: Vec<Dataset> = query
            .get_results(&conn)
            .map_err(|_| ServiceError::InternalServerError("Failed to retrive datasets".into()))?;

        Ok(results)
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
        sort: Option<SortParams>,
        format: Option<Format>,
        include_metadata: Option<bool>,
    ) -> Result<String, ServiceError> {
        let q = match query {
            Some(query) => query,
            None => format!(r#"select * from "{}""#, self.table_name),
        };

        let metadata = PostgisQueryRunner::run_query_meta(pool, &q).await?;
        let f = format.unwrap_or_default();

        let result = PostgisQueryRunner::run_query(pool, &q, page, sort, f).await?;
        let result_with_metadata = match include_metadata {
            Some(true) => json!({
            "data": result,
            "metadata": {
                "total": metadata.total
            }}),
            Some(false) | None => json!(result),
        };
        Ok(result_with_metadata.to_string())
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

    pub fn setup_or_update_sync(&self, pool: &DbPool) -> Result<(), ServiceError> {
        if self.sync_dataset {
            let pending_syncs = SyncImport::for_dataset(pool, &self.id)?;
            if pending_syncs.is_empty() {
                SyncImport::start_for_dataset(pool, self)?;
            }
        }
        Ok(())
    }

    pub async fn update_feature(
        &self,
        pool: &DbPool,
        feature_id: String,
        update: serde_json::Value,
    ) -> Result<serde_json::Value, ServiceError> {
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
            self.table_name, set_statement, self.id_col, feature_id
        );
        info!("Update query is {}", query.clone());
        let query2 = query.clone();
        web::block(move || diesel::sql_query(&query).execute(&conn))
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, query2);
                ServiceError::APIFailed(format!("SQL Error: {} API was {}", e, query2))
            })?;
        Ok(update)
    }

    pub async fn get_column(
        &self,
        db: &DataDbPool,
        col_name: String,
    ) -> Result<Column, ServiceError> {
        let cols = self.columns(db).await?;

        let result = cols
            .iter()
            .find(|col| col.name == col_name)
            .ok_or_else(|| {
                ServiceError::BadRequest(format!(
                    "No columns by the name of {} on table {}",
                    col_name, self.name
                ))
            })?;
        Ok((*result).clone())
    }

    pub async fn columns(&self, db: &DataDbPool) -> Result<Vec<Column>, ServiceError> {
        let columns = PostgisQueryRunner::get_query_column_details(
            db,
            &format!("select * from {}", self.table_name),
        )
        .await?;
        Ok(columns)
    }
}
