use crate::{
    errors::ServiceError,
    models::User,
    utils::{Format, PaginationParams, QueryMetadata, SortParams},
};
use async_trait::async_trait;

use super::{DataDbPool, MVTTile, TileID, TilerOptions};

#[async_trait]
pub trait DataSource {
    /// Run a query against the datasource.
    /// Returns a serde_json value for now but this is likley to change in the future
    async fn run_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
        page: Option<PaginationParams>,
        sort: Option<SortParams>,
        format: Format,
    ) -> Result<serde_json::Value, ServiceError>;

    /// Run a query against the datasource and return an MVTTile.
    async fn run_tile_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
        tiler_options: TilerOptions,
        tile_id: TileID,
    ) -> Result<MVTTile, ServiceError>;

    /// Run a query against the datasource and return the associated metadata.
    /// In this case it's just the total number of columns in the result.
    async fn run_metadata_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
    ) -> Result<QueryMetadata, ServiceError>;

    /// Sets up a new user with a domain within the datasource
    async fn setup_user(pool: &DataDbPool, user: &User) -> Result<(), ServiceError>;

}
