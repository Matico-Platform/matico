use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::schema::queries::{self, dsl};
use crate::utils::PaginationParams;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_as_jsonb::AsJsonb;
use log::info;
use serde::{Deserialize, Serialize};
use std::convert::From;
use std::fmt::{Display, Formatter};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub enum ValueType {
    Numeric(f32),
    Categorical(String),
    Text(String),
    Dataset(Uuid),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateQueryDTO {
    pub name: String,
    pub description: String,
    pub sql: String,
    pub parameters: Vec<QueryParam>,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "queries"]
pub struct UpdateQueryDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub sql: Option<String>,
    pub parameters: Option<Params>,
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

trait QueryParameter {
    fn modify_sql(&mut self, sql: String, value: ValueType) -> Result<String, ServiceError>;
    fn name(&self) -> &String;
    fn description(&self) -> &String;
    fn default_value(&self) -> &ValueType;
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NumericQueryParameter {
    pub name: String,
    pub description: String,
    pub default_value: ValueType,
}

impl QueryParameter for NumericQueryParameter {
    fn name(&self) -> &String {
        &self.name
    }

    fn description(&self) -> &String {
        &self.description
    }

    fn default_value(&self) -> &ValueType {
        &self.default_value
    }

    fn modify_sql(&mut self, sql: String, value: ValueType) -> Result<String, ServiceError> {
        match value {
            ValueType::Numeric(val) => {
                let target = &format!("${{{}}}", self.name());
                Ok(sql.replace(target, &val.to_string()))
            }
            _ => Err(ServiceError::BadRequest(format!(
                "Query parameter {} got the wrong type",
                self.name()
            ))),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum QueryParam {
    Numerical(NumericQueryParameter),
}

#[derive(AsJsonb, AsExpression, Debug, Serialize, Deserialize)]
pub struct Params {
    pub params: Vec<QueryParam>,
}

#[derive(Serialize, Deserialize, Insertable, AsChangeset, Queryable, Associations)]
#[table_name = "queries"]
pub struct Query {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub sql: String,
    pub parameters: Params,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl From<CreateQueryDTO> for Query {
    fn from(user: CreateQueryDTO) -> Self {
        let parameters = Params {
            params: user.parameters,
        };
        Self::new(user.name, user.description, user.sql, parameters)
    }
}

impl Query {
    pub fn new(name: String, description: String, sql: String, parameters: Params) -> Self {
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
        update_params: UpdateQueryDTO,
    ) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        let updated_query = diesel::update(queries::table.filter(queries::id.eq(&id)))
            .set(update_params)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to update query {} ", e)))?;
        Ok(updated_query)
    }

    pub fn create_or_update(&self, pool: &DbPool) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        info!("Attempting to create query");

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

    pub fn create(pool: &DbPool, new_query: CreateQueryDTO) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        let query: Self = new_query.into();
        query.create_or_update(pool)
    }

    pub fn find(pool: &DbPool, id: Uuid) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();
        let query = queries::table
            .filter(queries::id.eq(id))
            .first(&conn)
            .map_err(|_| ServiceError::BadRequest(format!("Failed to find query {}", id)))?;
        Ok(query)
    }

    //TODO add auth check
    pub fn delete(pool: &DbPool, id: Uuid) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::delete(queries::table.filter(queries::id.eq(&id)))
            .execute(&conn)
            .map_err(|_| ServiceError::BadRequest("Failed to delete query".into()))?;
        Ok(())
    }

    pub fn search(pool: &DbPool, page: PaginationParams) -> Result<Vec<Self>, ServiceError> {
        let conn = pool.get().unwrap();
        let results = dsl::queries
            .get_results(&conn)
            .map_err(|_| ServiceError::InternalServerError("Failed to get queries".into()))?;
        Ok(results)
    }
}
