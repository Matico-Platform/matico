use crate::db::{DataDbPool, DbPool, PostgisQueryRunner};
use crate::errors::ServiceError;
use crate::schema::queries::{self, dsl};
use crate::utils::{Format, PaginationParams};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_as_jsonb::AsJsonb;
use log::info;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::convert::From;
use std::fmt::{Display, Formatter};
use serde_json::json;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub enum ValueType {
    Numeric(f64),
    Categorical(String),
    Text(String),
    Dataset(Uuid),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AnnonQuery{
    pub q: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateAPIDTO {
    pub name: String,
    pub description: String,
    pub sql: String,
    pub parameters: Vec<APIParam>,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "queries"]
pub struct UpdateAPIDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub sql: Option<String>,
    pub parameters: Option<Vec<APIParam>>,
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
#[serde(tag="type")]
pub enum APIParam {
    Numerical(NumericAPIParameter),
}

#[derive(Serialize, Deserialize, Insertable, AsChangeset, Queryable, Associations)]
#[table_name = "queries"]
pub struct API {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub sql: String,
    pub parameters: Vec<APIParam>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl From<CreateAPIDTO> for API {
    fn from(user: CreateAPIDTO) -> Self {
        let parameters = user.parameters;
        Self::new(user.name, user.description, user.sql, parameters)
    }
}

impl API {
    pub fn new(
        name: String,
        description: String,
        sql: String,
        parameters: Vec<APIParam>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            description,
            sql,
            parameters,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
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
        params: HashMap<String, serde_json::Value>,
    ) -> Result<String, ServiceError> {
        let mut api = self.sql.clone();

        for q_param in self.parameters.clone() {
            match q_param {
                APIParam::Numerical(param) => {
                    let input =
                        params
                            .get(param.name())
                            .ok_or_else(|| ServiceError::APIFailed(format!(
                                "missing param {}",
                                param.name()
                            )))?;
                    info!("parsing parameter for {}, {}", param.name(), input);
                    let input_val_str = input.as_str().ok_or_else(|| ServiceError::APIFailed(
                        format!("Failed to parse value for {},{:?} ", param.name(), input),
                    ))?;
                    let input_val: f64 = input_val_str.parse().map_err(|_| {
                        ServiceError::APIFailed("Failed to parse parameter".into())
                    })?;

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
        page: Option<PaginationParams>,
        format: Option<Format>,
    ) -> Result<String, ServiceError> {
        let f = format.unwrap_or_default();

        //TODO Move this to PostgisQueryRunner
        let metadata = PostgisQueryRunner::run_query_meta(pool, &query).await?;


        let result = PostgisQueryRunner::run_query(pool, &query, page, f).await?;

        let result_with_metadata = json!({
            "data":result,
            "metadata":{
                "total": metadata.total
            }
        });

        Ok(result_with_metadata.to_string())
    }

    pub async fn run(
        &self,
        pool: &DataDbPool,
        params: HashMap<String, serde_json::Value>,
        page: Option<PaginationParams>,
        format: Option<Format>,
    ) -> Result<String, ServiceError> {
        let f = format.unwrap_or_default();

        let query = self.construct_query(params)?;
        let result = PostgisQueryRunner::run_query(pool, &query, page, f).await?;
        Ok(result.to_string())
    }
}
