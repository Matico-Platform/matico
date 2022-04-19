use crate::db::postgis_datasource::{Bounds, PostgisDataSource};
use crate::db::{DataDbPool, DataSource};
use crate::errors::ServiceError;
use crate::utils::Format;
use log::info;
use ts_rs::TS;
use crate::models::{User,stats::*};
use serde::{Serialize,Deserialize};


#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct Column {
    pub name: String,
    pub col_type: String,
}

