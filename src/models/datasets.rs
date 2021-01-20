use serde::{Deserialize,Serialize};
use chrono::{NaiveDateTime, Utc};
use uuid::Uuid;
use diesel::prelude::*;
use crate::models::User;

use crate::errors::ServiceError;
use crate::db::DbPool;
use crate::schema::datasets;


#[derive(Debug,Serialize,Deserialize,Queryable,Associations)]
#[belongs_to(parent="User", foreign_key="owner_id")]
#[table_name = "datasets"]
pub struct Dataset{
    pub id: Uuid,
    owner_id:Uuid,
    name: String,
    original_filename: String,
    original_type: String,
    sync_dataset: Option<bool>,
    sync_url: Option<String>,
    sync_frequency_seconds: Option<usize>,
    post_import_script: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}