use super::QueryBuilder;
use super::QueryResult;
use super::QueryVal;
use crate::db::DataDbPool;
use crate::db::DataSource;
use crate::errors::ServiceError;
use crate::models::datasets::Extent;
use crate::models::{
    stats::*, Api, Column as DatasetColumn, Dataset, StatParams, StatResults, StatRunner, User,
};
use crate::utils::{MVTTile, PaginationParams, QueryMetadata, SortParams};
use async_trait::async_trait;
use cached::proc_macro::cached;
use geozero::wkb;
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgRow, PgTypeInfo};
use sqlx::{Column, Row, TypeInfo};
use std::collections::BTreeMap;
use std::collections::HashMap;
use std::convert::From;

#[derive(Serialize, Deserialize)]
pub struct BBox {
    x_min: f32,
    x_max: f32,
    y_min: f32,
    y_max: f32,
}

#[derive(Serialize, Deserialize)]
pub struct Bounds {
    bounds: Option<BBox>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct TilerOptions {
    geom_column: Option<String>,
    tolerance: Option<u64>,
    crs: Option<String>,
}

pub struct Filter {}

#[derive(Deserialize, Debug)]
pub struct TileID {
    x: f64,
    y: f64,
    z: f64,
}

fn row_to_map(row: PgRow) -> BTreeMap<String, Option<QueryVal>> {
    let mut hash: BTreeMap<String,Option<QueryVal>> = BTreeMap::new();
    for (index,col) in row.columns().iter().enumerate() {
        let type_info: &PgTypeInfo = col.type_info();
        // info!("Column type is {:#?} {:#?}", type_info, type_info.name() );
        let val: Option<QueryVal> = match type_info.name() {
             "INT2" | "INT4" => {
                let val: Option<i32> = row.get(col.name());
                let val =val.map(|c| c as i64);
                val.map(|v| QueryVal::Int(v))
            }
             "INT8"  => {
                let val: Option<i64> = row.get(col.name());
                val.map(|v| QueryVal::Int(v))
             }
            "FLOAT4" | "FLOAT8" => {
                let val: Option<f64> = row.get(col.name());
                val.map(|v| QueryVal::Float(v))
            }
            "NUMERIC" => {
                let val: Option<sqlx::types::BigDecimal> = row.get(col.name());
                val.map(|v| QueryVal::Numeric(v))
            }
            "TEXT" | "VARCHAR" => {
                let val: Option<String> = row.get(col.name());
                val.map(|v| QueryVal::Text(v))
            }
            "geometry" => {
                let val: Option<wkb::Decode<geo_types::Geometry<f64>>> = row.get(col.name());
                val.map(|v| QueryVal::Geometry(v.geometry.unwrap()))
            }
            "BOOL" => {
                let val: Option<bool> = row.get(col.name());
                val.map(|v| QueryVal::Bool(v))
            }
            _ => {
                tracing::warn!("Unsupported postgis type {:#?}", type_info);
                Some(QueryVal::Unsupported)
            }
        };
        hash.insert(col.name().to_string(), val);
    }
    hash
}

#[derive(Default)]
pub struct PostgisQueryBuilder {
    dataset: Option<Dataset>,
    api: Option<Api>,
    api_params: Option<HashMap<String, serde_json::Value>>,
    query: Option<String>,
    columns:Option<Vec<String>>,
    filters: Option<Vec<Filter>>,
    user: Option<User>,
    bounds: Option<Bounds>,
    page: Option<PaginationParams>,
    sort: Option<SortParams>,
    tile: Option<TileID>,
}

impl PostgisQueryBuilder {
    pub fn new() -> Self {
        Default::default()
    }
}

#[async_trait]
impl QueryBuilder<DataDbPool> for PostgisQueryBuilder {
    fn dataset(&mut self, dataset: Dataset) -> &mut Self {
        self.dataset = Some(dataset);
        self
    }

    fn api(&mut self, api: Api, params: HashMap<String, serde_json::Value>) -> &mut Self {
        self.api = Some(api);
        self.api_params = Some(params);
        self
    }

    fn query(&mut self, query: String) -> &mut Self {
        self.query = Some(query);
        self
    }

    fn filters(&mut self, filters: Vec<Filter>) -> &mut Self {
        self.filters = Some(filters);
        self
    }

    fn user(&mut self, user: User) -> &mut Self {
        self.user = Some(user);
        self
    }

    fn bounds(&mut self, bounds: Bounds) -> &mut Self {
        self.bounds = Some(bounds);
        self
    }

    fn page(&mut self, page: PaginationParams) -> &mut Self {
        self.page = Some(page);
        self
    }

    fn sort(&mut self, sort: SortParams) -> &mut Self {
        self.sort = Some(sort);
        self
    }

    fn tile(&mut self, tile: TileID) -> &mut Self {
        self.tile = Some(tile);
        self
    }

    fn columns(&mut self, columns: Vec<String>) -> &mut Self {
        self.columns= Some(columns);
        self
    }

    fn base_query(&self) -> Result<String, ServiceError> {
        match (&self.query, &self.dataset, &self.api, &self.api_params) {
            (Some(query), None, None, None) => Ok(query.clone()),
            (None, Some(dataset), None, None) => {
                Ok(format!("select * from {}", dataset.table_name))
            }
            (None, None, Some(api), Some(params)) => api.construct_query(&params),
            (None, None, Some(_api), None) => Err(ServiceError::InternalServerError(
                "An API was set without specifying parameters".into(),
            )),
            (None, None, None, None) => Err(ServiceError::InternalServerError(
                "Query builder requires at least one of Dataset, API or query ".into(),
            )),
            _ => Err(ServiceError::InternalServerError(
                "Multiple sources set for query builder".into(),
            )),
        }
    }

    fn build_query(&self) -> Result<String, ServiceError> {
        let mut base_query = self.base_query()?;

        // let base_query = if let Some(filters)= self.filters{
        //     format!("{} WHERE {}",base_query,filters)
        // };

        // let base_query = if let Some(bounds)= self.bounds{
        //     format!("{} {}",base_query,bounds)
        // };

        if let Some(sort) = &self.sort {
            base_query = format!("{} {}", base_query, sort)
        }

        if let Some(page) = &self.page {
            base_query = format!("{} {}", base_query, page)
        };

        if let Some(columns) = &self.columns{
            let col_string = columns.iter().map(|c| format!("\"{}\"",c)).collect::<Vec<String>>().join(",");
            base_query = format!("select {} from  ({}) as final",col_string , base_query );
        }
        Ok(base_query)
    }

    async fn metadata(&self, db: &DataDbPool) -> Result<QueryMetadata, ServiceError> {
        let base_query = self.build_query()?;
        let result = sqlx::query(&format!(
            "SElECT count(*) as total from ({}) a ",
            base_query
        ))
        .map(|row: PgRow| QueryMetadata {
            total: row.get("total"),
        })
        .fetch_one(db)
        .await
        .map_err(|e| {
            tracing::warn!("Failed to get metadata for query, {}", e);
            ServiceError::QueryFailed(format!("SQL Error: {} Query was  {}", e, base_query))
        })?;

        Ok(result)
    }

    async fn get_extent(&self, db: &DataDbPool, geom_col: &str) -> Result<Extent, ServiceError> {
        let base_query = self.build_query()?;

        let query = format!(
            "Select ARRAY [
                           ST_XMIN(ST_EXTENT({geom_col})),
                           ST_YMIN(ST_EXTENT({geom_col})),
                           ST_XMAX(ST_EXTENT({geom_col})),
                           ST_YMAX(ST_EXTENT({geom_col}))
                           ]
                           as extent from ({base_query}) as a",
            geom_col = geom_col,
            base_query = base_query
        );

        let extent: Extent = sqlx::query_as(&query)
            .fetch_one(db)
            .await
            .map_err(|e| ServiceError::APIFailed(format!("Failed to get bounding box {}", e)))?;
        Ok(extent)
    }

    async fn get_columns(&self, db: &DataDbPool) -> Result<Vec<DatasetColumn>, ServiceError> {
        let query = self.build_query()?;
        local_get_query_column_details(&db, &query).await
    }

    async fn get_tile(
        &self,
        db: &DataDbPool,
        tiler_options: TilerOptions,
        tile_id: TileID,
    ) -> Result<MVTTile, ServiceError> {
        let query = self.build_query()?;
        cached_tile_query(db, &query, tiler_options, tile_id).await
    }

    async fn get_result(&self, db: &DataDbPool) -> Result<QueryResult, ServiceError> {
        let query = self.build_query()?;

        let result = sqlx::query(&query)
            .map(row_to_map)
            .fetch_all(db)
            .await
            .map_err(|e| ServiceError::QueryFailed(format!("Query Failed : {}", e)))?;

        Ok(QueryResult {
            result,
            execution_type: 0,
        })
    }

    // TODO Try to figure out how to make this work so we can stream results to the frontend
    //
    // fn get_result_stream(&self, db: &DataDbPool)->BoxStream<'_, Result<HashMap<String,QueryVal>, sqlx::Error>>{
    //    let query = self.build_query().unwrap();
    //    let stream = sqlx::query(&query)
    //        .map(row_to_map)
    //        .fetch(db);

    //    stream
    // }

    async fn get_feature(
        &self,
        db: &DataDbPool,
        feature_id: &QueryVal,
        id_col: Option<&str>,
    ) -> Result<BTreeMap<String, Option<QueryVal>>, ServiceError> {
        let base_query = self.build_query()?;

        // TODO prob a better way to do this
        let id_col = if let Some(id) = id_col {
            Some(String::from(id))
        } else {
            if let Some(d) = &self.dataset {
                Some(d.id_col.clone())
            } else {
                None
            }
        };

        let id_col = id_col.ok_or_else(|| {
            ServiceError::QueryFailed(
                "For feature requests on queries or apis, please include an id col".into(),
            )
        })?;

        let query = format!(
            "select * from ({query}) where '{column}' = {id:?}",
            query = base_query,
            column = id_col,
            id = feature_id
        );
        let result = sqlx::query(&query)
            .map(row_to_map)
            .fetch_one(db)
            .await
            .map_err(|e| ServiceError::QueryFailed(format!("Failed to get feature {:#?}", e)))?;
        Ok(result)
    }

    async fn get_stat_for_column(
        &self,
        db: &DataDbPool,
        column: &DatasetColumn,
        stat_params: &StatParams,
    ) -> Result<StatResults, ServiceError> {
        PostgisStatRunner::calculate_stat(db, column, stat_params, self).await
    }
}

async fn local_get_query_column_details(
    pool: &DataDbPool,
    query: &str,
) -> Result<Vec<DatasetColumn>, ServiceError> {
    let columns = sqlx::query(query)
        .map(|row: PgRow| {
            let cols = row.columns();
            let columns: Vec<DatasetColumn> = cols
                .iter()
                .map(|col| DatasetColumn {
                    name: col.name().to_string(),
                    col_type: col.type_info().name().into(),
                })
                .collect();
            columns
        })
        .fetch_one(pool)
        .await
        .map_err(|e| {
            tracing::warn!("SQL Query failed: {} {}", e, query);
            ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, query))
        })?;

    Ok(columns)
}

#[cached(
    size = 1,
    time = 86400,
    result = true,
    convert = r#"{format!("{}_{:?}_{:?}",query,tiler_options,tile_id) }"#,
    key = "String"
)]
pub async fn cached_tile_query(
    pool: &DataDbPool,
    query: &str,
    tiler_options: TilerOptions,
    tile_id: TileID,
) -> Result<MVTTile, ServiceError> {
    // TODO This is an annoying and potentially non preformat
    // way of getting the columns names we want to include.
    // One solution will be to require the passing of the
    // required columns in the query. Another might be to see
    // if we can easily cache this call in the server. Better would
    // be if postgresql had an exclude keyword or if we can find some
    // other way to do this in the db
    let time_start = chrono::Utc::now();

    let columns = local_get_query_column_details(pool, query).await?;
    tracing::info!(target:"mvt_tile", "Column Query : {}", (chrono::Utc::now() - time_start).num_seconds() );

    let column_names: Vec<String> = columns
        .iter()
        .filter(|col| col.col_type != "geometry")
        .map(|col| format!("\"{}\"", col.name))
        .collect();
    let select_string = column_names.join(",");

    let geom_column = match tiler_options.geom_column {
        Some(column) => column,
        None => String::from("wkb_geometry"),
    };

    let formatted_query = format!(
        include_str!("tile_query.sql"),
        columns = select_string,
        geom_column = geom_column,
        tile_table = query,
        x = tile_id.x,
        y = tile_id.y,
        z = tile_id.z,
    );

    let time_start_tile = chrono::Utc::now();
    let result: Vec<u8> = sqlx::query(&formatted_query)
        .map(|row: PgRow| row.get("mvt"))
        .fetch_one(pool)
        .await
        .map_err(|e| {
            tracing::warn!("SQL Query failed: {} {}", e, formatted_query);
            ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
        })?;

    tracing::info!(target: "mvt_tile", "Tile: {}", (chrono::Utc::now() - time_start_tile).num_seconds() );
    tracing::info!(target: "mvt_tile", "Total {}", (chrono::Utc::now() - time_start).num_seconds());
    Ok(MVTTile { mvt: result })
}

pub struct PostgisDataSource;

impl PostgisDataSource {
    pub async fn create_public_user(pool: &DataDbPool) -> Result<(), ServiceError> {
        let user_exists = sqlx::query("SELECT 1 FROM pg_user WHERE usename= 'global_public'")
            .fetch_one(pool)
            .await
            .is_ok();

        if !user_exists {
            sqlx::query("CREATE USER global_public")
                .execute(pool)
                .await
                .map_err(|_| {
                    ServiceError::InternalServerError("Failed to create public user".into())
                })?;
        }
        Ok(())
    }
}

#[async_trait]
impl DataSource<DataDbPool> for PostgisDataSource {
    async fn setup(pool: &DataDbPool) -> Result<(), ServiceError> {
        Self::create_public_user(&pool).await?;
        Ok(())
    }
    async fn setup_user(pool: &DataDbPool, user: &User) -> Result<(), ServiceError> {
        sqlx::query("CREATE USER $1 ")
            .bind(user.username.clone())
            .execute(pool)
            .await
            .map_err(|e| {
                tracing::warn!("Failed to create user in database {:#?}", e);
                ServiceError::InternalServerError("Failed to create user on database".into())
            })?;

        Ok(())
    }
}

pub struct PostgisStatRunner;

impl PostgisStatRunner {
    async fn calc_quantiles(
        db: &DataDbPool,
        column: &DatasetColumn,
        params: &QuantileParams,
        query: &PostgisQueryBuilder,
    ) -> Result<StatResults, ServiceError> {
        let _treat_nulls_as_zero = params.treat_null_as_zero.unwrap_or(false);
        let base_query = query.build_query()?;

        let query =format!(
                "
                SELECT
                    ntile::INT as quantile,
                    CAST(min({column}) AS FLOAT) AS bin_start,
                    CAST(max({column}) AS FLOAT) AS bin_end
                    FROM (
                        SELECT {column}, ntile({bins}) OVER (ORDER BY {column}) AS ntile FROM ({source_query}) as y ) x
                    GROUP BY ntile 
                    ORDER BY ntile
                ",
                column =column.name,
                source_query = base_query,
                bins = params.no_bins
            );

        let results: Vec<QuantileEntry> = sqlx::query_as::<_, QuantileEntry>(&query)
            .fetch_all(db)
            .await
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to get quantile result {:#?}", e))
            })?;

        tracing::info!("JSON RESPONSE {:?}", results);

        Ok(StatResults::Quantiles(QuantileResults(results)))
    }

    async fn calc_histogram(
        db: &DataDbPool,
        column: &DatasetColumn,
        params: &HistogramParams,
        query: &PostgisQueryBuilder,
    ) -> Result<StatResults, ServiceError> {
        let _treat_nulls_as_zero = params.treat_null_as_zero.unwrap_or(false);
        let base_query = query.build_query()?;

        let query = match &params.bin_edges {
            Some(edges) => format!("We have not yet implemented custom bin edges {:?}", edges),
            None => format!(
                "
                select  bin_no::FLOAT,
                        (bin_no *(max-min)/{bin_no})::FlOAT as bin_start, 
                        ((bin_no +1 ) * (max-min)/{bin_no})::FLOAT as bin_end,
                        ((bin_no +0.5 ) * (max-min)/{bin_no})::FLOAT as bin_mid,
                        count(*)::FLOAT as freq
                FROM (
                        select width_bucket({col}::NUMERIC, min, max, {bin_no}) as bin_no
                        from ({source_query}) as query,
                        ( select max({col}::NUMERIC) as max,
                                 min({col}::NUMERIC) as min
                          FROM ({source_query}) as sq 
                        ) as    stats
                    ) iq,
                    ( select max({col}::NUMERIC) as max,
                             min({col}::NUMERIC) as min
                          FROM ({source_query}) as sq 
                    ) as    stats
                        group by bin_no, stats.max, stats.min
                        order by bin_no
                ",
                col = column.name,
                source_query = base_query,
                bin_no = params.no_bins
            ),
        };

        let results: Vec<HistogramEntry> = sqlx::query_as::<_, HistogramEntry>(&query)
            .fetch_all(db)
            .await
            .map_err(|e| {
                ServiceError::InternalServerError(format!(
                    "Failed to get histogram result {:#?}",
                    e
                ))
            })?;

        Ok(StatResults::Histogram(HistogramResults(results)))
    }

    async fn calc_value_counts(
        db: &DataDbPool,
        column: &DatasetColumn,
        _params: &ValueCountsParams,
        query: &PostgisQueryBuilder,
    ) -> Result<StatResults, ServiceError> {
        let base_query = query.build_query()?;
        let query = format!(
            "
            select COALESCE({}::TEXT,'undefined') as name, count(*) as count 
            from ({}) a
            group by COALESCE({}::TEXT,'undefined')
            order by count DESC",
            column.name, base_query, column.name
        );

        let results: Vec<ValueCountEntry> = sqlx::query_as::<_, ValueCountEntry>(&query)
            .fetch_all(db)
            .await
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to get quantile result {:#?}", e))
            })?;

        Ok(StatResults::ValueCounts(ValueCountsResults(results)))
    }

    async fn calc_basic_stats(
        db: &DataDbPool,
        column: &DatasetColumn,
        _params: &BasicStatsParams,
        query: &PostgisQueryBuilder,
    ) -> Result<StatResults, ServiceError> {
        let base_query = query.build_query()?;

        let query = format!(
            "select max({col}::NUMERIC) as max,
                    min({col}::NUMERIC) as min,
                    avg({col}::NUMERIC) as mean,
                    sum({col}::NUMERIC) as total,
                    count({col}::NUMERIC) as count,
                    avg({col}::NUMERIC) as median
                    from ({query}) b 
                    ",
            col = column.name,
            query = base_query
        );

        let result: BasicStatsResults =
            sqlx::query_as(&query).fetch_one(db).await.map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to get basic stats {:#?}", e))
            })?;

        Ok(StatResults::BasicStats(result))
    }
}

#[async_trait]
impl StatRunner<DataDbPool, PostgisQueryBuilder> for PostgisStatRunner {
    async fn calculate_stat(
        db: &DataDbPool,
        column: &DatasetColumn,
        stat_params: &StatParams,
        query: &PostgisQueryBuilder,
    ) -> Result<StatResults, ServiceError> {
        match stat_params {
            // StatParams::Percentiles(params) => self.calc_percentiles(conn, params).await,
            StatParams::ValueCounts(params) => {
                Self::calc_value_counts(db, column, params, query).await
            }
            StatParams::BasicStats(params) => {
                Self::calc_basic_stats(db, column, params, query).await
            }
            StatParams::Histogram(params) => Self::calc_histogram(db, column, params, query).await,
            StatParams::Quantiles(params) => Self::calc_quantiles(db, column, params, query).await,
            _ => Err(ServiceError::BadRequest("Stat not implemented".into())),
        }
    }
}
