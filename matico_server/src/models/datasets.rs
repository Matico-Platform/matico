use crate::models::User;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use log::info;
use serde::{Deserialize, Serialize};
use sqlx::{Row, FromRow};
use uuid::Uuid;

use crate::db::{ DbPool };
use crate::errors::ServiceError;
use crate::models::{ Permission, PermissionType, ResourceType, SyncImport};
use crate::schema::datasets::{self, dsl::*};
use crate::utils::ImportParams;

#[derive(Serialize, Deserialize, Clone, Debug, FromRow)]
pub struct Extent {
    pub extent: Vec<f64>,
}

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

    /// Will set up, or change the parameters for the sync requests for this dataset
    ///
    /// Any pending syncs should be retired (Not actually implemented yet)
    /// and a new seed SyncImport is generated
    pub fn setup_or_update_sync(&self, pool: &DbPool) -> Result<(), ServiceError> {
        if self.sync_dataset {
            let pending_syncs = SyncImport::for_dataset(pool, &self.id)?;
            if pending_syncs.is_empty() {
                SyncImport::start_for_dataset(pool, self)?;
            }
        }
        Ok(())
    }


}
