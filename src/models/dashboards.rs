use crate::models::map_style::MapStyle;
use crate::schema::dashboards;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Queryable, Insertable)]
#[table_name = "dashboards"]
pub struct Dashboard {
    pub id: Uuid,
    pub name: String,
    pub owner_id: Uuid,
    pub description: String,
    pub map_style: MapStyle,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDatasetDTO {
    pub name: String,
    pub owner_id: Uuid,
    pub description: String,
    pub map_style: MapStyle,
    pub public: bool,
}

pub struct UpdateDatasetDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub map_style: Option<MapStyle>,
    pub public: bool,
}
