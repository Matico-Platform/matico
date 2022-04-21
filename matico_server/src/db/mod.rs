// mod postgis_data_source;
pub type DbPool = r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>;
pub type DataDbPool = sqlx::PgPool;

pub mod datasource;
pub mod postgis_datasource;
pub mod query_builder;
pub mod query_result;
pub mod setup;

pub use datasource::*;
pub use postgis_datasource::*;
pub use query_builder::*;
pub use query_result::*;
pub use setup::*;
