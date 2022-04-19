use std::collections::HashMap;

use async_trait::async_trait;
use futures::stream::{LocalBoxStream, BoxStream};

use crate::{models::{Dataset, Column as DatasetColumn, User, Api, StatParams, StatResults, datasets::Extent}, utils::{PaginationParams, SortParams, MVTTile, QueryMetadata}, errors::ServiceError};

use super::{Filter, Bounds, TileID, TilerOptions, QueryResult, QueryVal};

#[async_trait]
pub trait QueryBuilder<T>{

    /// Use the given dataset as the base of this query 
     fn dataset(&mut self, dataset:Dataset)->&mut Self;

    /// Use the given api with arguments applied for this query
     fn api(&mut self, api:Api, params: HashMap<String, serde_json::Value>)->&mut Self;

    /// Use the raw query string as the basis for this query
     fn query(&mut self, query:String)->&mut Self;

    /// Apply the set of filters provided to this query
     fn filters(&mut self,filters:Vec<Filter>)->&mut Self;

    /// Set the query to use the passed user permisions 
    /// If none is set the query will use the default lic user
     fn user(&mut self, user:User)->&mut Self;

    /// Set the geographic bounds in which the query must return
     fn bounds(&mut self, bounds: Bounds)->&mut Self;

    /// Set the pagination parameters for the query 
    /// If none are set the query will return in full
     fn page(&mut self, page:PaginationParams) ->&mut Self;

    /// Set the sort parameters for the query
    /// If none are set then the query will come back in whatever 
    /// order the base query does
     fn sort(&mut self, sort:SortParams)->&mut Self;

    /// Set the tile id of the query 
    /// This will limit the query returned to geometries 
    /// within that tile ID
     fn tile(&mut self, tile:TileID)->&mut Self;

    /// This function should construct the base query depending on pervious config 
    /// For example if a Dataset is passed the base query should select from that base datasource
    /// Note: We might have to change this from returning a Result<String,ServiceError> to
    /// something more generic depending on how other interfaces use this system
    fn base_query(&self)->Result<String,crate::errors::ServiceError>;


    /// Builds the final query taking in to account the base query, the base query, user, filters,
    /// bounds, sort, pagination and tileID 
    fn build_query(&self)->Result<String, ServiceError>;
   
    /// Get metadata for the current query, number of rows etc
    async fn metadata(&self,db: &T)->Result<QueryMetadata, ServiceError>;
    
    /// Get the physical extent this query corresponds to
    async fn extent(&self,db: &T, geom_col: &str)->Result<Extent, ServiceError>;

    /// Run the column query associated with this request and return column definitions
     async fn columns(&self, db: &T)->Result< Vec<DatasetColumn> , ServiceError>;

    /// Run the tile query associated with this request and return the MVT tile 
     async fn get_tile(&self, db: &T,
        tiler_options: TilerOptions,
        tile_id: TileID
        )->Result<MVTTile,ServiceError>;

    /// Run the data query and return the result as a QueryResult struct 
     async fn get_result(&self, db: &T)-> Result<QueryResult, ServiceError>;

    /// Run the data query and return the result as a stream 
     // fn get_result_stream(&self, db: &T)->BoxStream<'_, Result<HashMap<String,QueryVal>, sqlx::Error>>;

     async fn get_feature(&self,db: &T, feature_id: &QueryVal , id_col: Option<&str>)->Result<HashMap<String,Option<QueryVal>>, ServiceError>;

     /// Calculate and return the associated stat for the column on the query
    async fn get_stat_for_column(&self,db:&T, column:&DatasetColumn, stat_params: &StatParams)->Result<StatResults, ServiceError>;
}
