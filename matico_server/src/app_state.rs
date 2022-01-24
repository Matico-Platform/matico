use crate::db::*;

#[derive(Clone)]
pub struct State {
    pub db: DbPool,
    pub data_db: DataDbPool,
    pub ogr_string: String
}
