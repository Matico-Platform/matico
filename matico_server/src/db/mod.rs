// mod postgis_data_source;
pub type DbPool = r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>;
pub type DataDbPool = sqlx::PgPool;

pub mod datasource;
pub mod formatters;
pub mod postgis_datasource;
pub mod setup;
pub mod query_result;
pub mod query_builder;

pub use query_result::*;
pub use query_builder::*;
pub use datasource::*;
pub use formatters::*;
pub use postgis_datasource::*;
pub use setup::*;
