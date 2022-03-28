use crate::auth::AuthService;
use crate::db::{DataDbPool, DataSource, DbPool, PostgisDataSource};
use crate::errors::ServiceError;
use crate::models::columns::Column;
use crate::models::datasets::Extent;
use crate::schema::queries::{self, dsl};
use crate::utils::{Format, PaginationParams, SortParams};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_as_jsonb::AsJsonb;
use log::info;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::postgres::PgRow;
use sqlx::Row;
use std::collections::HashMap;
use std::convert::From;
use std::fmt::{Display, Formatter};
use uuid::Uuid;

use super::User;

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub enum ValueType {
    Numeric(f64),
    Categorical(String),
    Text(String),
    Dataset(Uuid),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AnnonQuery {
    pub q: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateAPIDTO {
    pub name: String,
    pub description: String,
    pub sql: Option<String>,
    pub parameters: Option<Vec<APIParam>>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "queries"]
pub struct UpdateAPIDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub sql: Option<String>,
    pub parameters: Option<Vec<APIParam>>,
    pub public: Option<bool>,
}

impl Display for ValueType {
    fn fmt(&self, f: &mut Formatter) -> std::fmt::Result {
        match self {
            Self::Numeric(value) => {
                write!(f, "{}", value)
            }
            Self::Categorical(category) => {
                write!(f, "{}", category)
            }
            Self::Text(text) => {
                write!(f, "{}", text)
            }
            Self::Dataset(id) => {
                write!(f, "{}", id)
            }
        }
    }
}

trait APIParameter {
    fn modify_sql(&self, sql: String, value: ValueType) -> Result<String, ServiceError>;
    fn name(&self) -> &String;
    fn description(&self) -> &String;
    fn default_value(&self) -> &ValueType;
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct NumericAPIParameter {
    pub name: String,
    pub description: String,
    pub default_value: ValueType,
}

impl APIParameter for NumericAPIParameter {
    fn name(&self) -> &String {
        &self.name
    }

    fn description(&self) -> &String {
        &self.description
    }

    fn default_value(&self) -> &ValueType {
        &self.default_value
    }

    fn modify_sql(&self, sql: String, value: ValueType) -> Result<String, ServiceError> {
        match value {
            ValueType::Numeric(val) => {
                let target = &format!("${{{}}}", self.name());
                Ok(sql.replace(target, &val.to_string()))
            }
            _ => Err(ServiceError::BadRequest(format!(
                "API parameter {} got the wrong type",
                self.name()
            ))),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, AsJsonb)]
#[serde(tag = "type")]
pub enum APIParam {
    Numerical(NumericAPIParameter),
}

#[derive(Serialize, Deserialize, Insertable, AsChangeset, Queryable, Associations)]
#[table_name = "queries"]
pub struct Api {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub sql: String,
    pub parameters: Vec<APIParam>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

impl From<CreateAPIDTO> for Api {
    fn from(api: CreateAPIDTO) -> Self {
        Self::new(
            api.name,
            api.description,
            api.sql.unwrap_or("select * from #{input_table}".into()),
            api.parameters.unwrap_or(vec![]),
            api.public.unwrap_or(false),
        )
    }
}

impl Api {
    pub fn new(
        name: String,
        description: String,
        sql: String,
        parameters: Vec<APIParam>,
        public: bool,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            description,
            sql,
            parameters,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
            public,
        }
    }

    pub fn update(
        pool: &DbPool,
        id: Uuid,
        update_params: UpdateAPIDTO,
    ) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        let updated_api = diesel::update(queries::table.filter(queries::id.eq(&id)))
            .set(update_params)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to update api {} ", e)))?;
        Ok(updated_api)
    }

    pub fn create_or_update(&self, pool: &DbPool) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        info!("Attempting to create api");

        diesel::insert_into(dsl::queries)
            .values(self)
            .on_conflict(queries::id)
            .do_update()
            .set(self)
            .get_result(&conn)
            .map_err(|e| {
                ServiceError::BadRequest(format!("Failed to create or update dataset, {}", e))
            })
    }

    pub fn create(pool: &DbPool, new_api: CreateAPIDTO) -> Result<Self, ServiceError> {
        let api: Self = new_api.into();
        api.create_or_update(pool)
    }

    pub fn find(pool: &DbPool, id: Uuid) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        let api = queries::table
            .filter(queries::id.eq(id))
            .first(&conn)
            .map_err(|_| ServiceError::BadRequest(format!("Failed to find api {}", id)))?;
        Ok(api)
    }

    //TODO add auth check
    pub fn delete(pool: &DbPool, id: Uuid) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::delete(queries::table.filter(queries::id.eq(&id)))
            .execute(&conn)
            .map_err(|_| ServiceError::BadRequest("Failed to delete api".into()))?;
        Ok(())
    }

    pub fn search(pool: &DbPool, _page: PaginationParams) -> Result<Vec<Self>, ServiceError> {
        let conn = pool.get().unwrap();
        let results = dsl::queries.get_results(&conn).map_err(|e| {
            ServiceError::InternalServerError(format!("Failed to get queries {}", e))
        })?;
        Ok(results)
    }

    pub fn construct_query(
        &self,
        params: &HashMap<String, serde_json::Value>,
    ) -> Result<String, ServiceError> {
        let mut api = self.sql.clone().replace(";", "");

        for q_param in self.parameters.clone() {
            match q_param {
                APIParam::Numerical(param) => {
                    let input = params.get(param.name()).ok_or_else(|| {
                        ServiceError::APIFailed(format!("missing param {}", param.name()))
                    })?;
                    info!("parsing parameter for {}, {}", param.name(), input);
                    let input_val_str = input.as_str().ok_or_else(|| {
                        ServiceError::APIFailed(format!(
                            "Failed to parse value for {},{:?} ",
                            param.name(),
                            input
                        ))
                    })?;
                    let input_val: f64 = input_val_str
                        .parse()
                        .map_err(|_| ServiceError::APIFailed("Failed to parse parameter".into()))?;

                    api = param.modify_sql(api, ValueType::Numeric(input_val))?;
                    info!("current api is {}", api);
                }
            }
        }
        Ok(api)
    }

    pub async fn run_raw(
        pool: &DataDbPool,
        query: String,
        user: &Option<User>,
        page: Option<PaginationParams>,
        sort: Option<SortParams>,
        format: Option<Format>,
    ) -> Result<String, ServiceError> {
        let f = format.unwrap_or_default();

        //TODO Move this to PostgisDataSource
        let metadata = PostgisDataSource::run_metadata_query(pool, &query, &user).await?;
        let result = PostgisDataSource::run_query(pool, &query, &user, page, sort, f).await?;

        let result_with_metadata = json!({
            "data":result,
            "metadata":{
                "total": metadata.total
            }
        });

        Ok(result_with_metadata.to_string())
    }

    /// Calculates the extent of the dataset
    ///
    pub async fn extent(
        &self,
        db: &DataDbPool,
        params: &HashMap<String, serde_json::Value>,
    ) -> Result<Extent, ServiceError> {
        let base_query = self.construct_query(params)?;
        let columns = self.columns(&db, &params).await?;

        let geom_col = columns
            .iter()
            .find(|c| c.col_type == "geometry")
            .ok_or_else(|| ServiceError::APIFailed("Query produced no geom column".into()))?;

        let query = format!(
            "Select ARRAY [
                            ST_XMIN(ST_EXTENT({geom_col})),
                            ST_YMIN(ST_EXTENT({geom_col})),
                            ST_XMAX(ST_EXTENT({geom_col})),
                            ST_YMAX(ST_EXTENT({geom_col}))
                            ]
                            as extent from ({query}) as a",
            geom_col = geom_col.name,
            query = base_query
        );

        println!("Extent query : {}", query);
        let extent = sqlx::query(&query)
            .map(|row: PgRow| Extent {
                extent: row.get("extent"),
            })
            .fetch_one(db)
            .await
            .map_err(|e| ServiceError::APIFailed(format!("Failed to get bounding box {}", e)))?;
        Ok(extent)
    }

    pub async fn get_column(
        &self,
        db: &DataDbPool,
        col_name: String,
        params: &HashMap<String, serde_json::Value>,
    ) -> Result<Column, ServiceError> {
        let cols = self.columns(db, params).await?;

        let result = cols
            .iter()
            .find(|col| col.name == col_name)
            .ok_or_else(|| {
                ServiceError::BadRequest(format!(
                    "No columns by the name of {} on table {}",
                    col_name, self.name
                ))
            })?;
        Ok((*result).clone())
    }

    pub async fn columns(
        &self,
        db: &DataDbPool,
        params: &HashMap<String, serde_json::Value>,
    ) -> Result<Vec<Column>, ServiceError> {
        let query = self.construct_query(params)?;
        let columns = PostgisDataSource::get_query_column_details(db, &query).await?;
        Ok(columns)
    }

    pub async fn run(
        &self,
        pool: &DataDbPool,
        params: &HashMap<String, serde_json::Value>,
        user: &Option<User>,
        page: Option<PaginationParams>,
        sort: Option<SortParams>,
        format: Option<Format>,
    ) -> Result<String, ServiceError> {
        let f = format.unwrap_or_default();

        let query = self.construct_query(params)?;
        let result = PostgisDataSource::run_query(pool, &query, user, page, sort, f).await?;
        Ok(result.to_string())
    }
}
