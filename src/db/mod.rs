// mod postgis_data_source;
pub type DbPool = r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>;
pub type DataDbPool = deadpool_postgres::Pool;

pub mod formatters;
pub mod queries;

pub use formatters::*;
pub use queries::*;
