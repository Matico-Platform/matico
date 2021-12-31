use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::map_style::MapStyle;
use crate::schema::apps;
use crate::utils::PaginationParams;

use diesel_as_jsonb::AsJsonb;
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::From;
use uuid::Uuid;
use matico_spec::Dashboard;

#[derive(AsJsonb,Debug,Serialize,Deserialize)]
pub struct AppSpec(matico_spec::Dashboard);

#[derive(Serialize, Deserialize, Debug, Queryable, Insertable)]
#[table_name = "apps"]
pub struct App{
    pub id: Uuid,
    pub name: String,
    pub owner_id: Uuid,
    pub description: String,
    pub spec: AppSpec,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateAppDTO{
    pub name: String,
    pub owner_id: Option<Uuid>,
    pub description: String,
    pub spec: AppSpec,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "apps"]
pub struct UpdateAppDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub spec: Option<AppSpec>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppSearch {
    pub name: Option<String>,
    pub description: Option<String>,
    pub user_id: Option<Uuid>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct AppOrderBy {
    field: Option<String>,
}

impl From<CreateAppDTO> for App {
    fn from(app: CreateAppDTO) -> Self {
        App{
            id: Uuid::new_v4(),
            name: app.name,
            description: app.description,
            spec: app.spec,
            public: app.public,
            owner_id: app.owner_id.unwrap(),
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}

impl App {
    pub fn search(
        pool: &DbPool,
        _order: AppOrderBy,
        search: AppSearch,
        _page: Option<PaginationParams>,
    ) -> Result<Vec<App>, ServiceError> {
        let conn = pool.get().unwrap();
        let mut query = apps::table.into_boxed();

        if let Some(name) = search.name {
            query = query.filter(apps::name.like(name))
        }

        if let Some(desc) = search.description {
            query = query.filter(apps::description.like(desc))
        }

        if let Some(user_id) = search.user_id {
            query = query.filter(apps::owner_id.eq(user_id))
        }

        if let Some(public) = search.public {
            query = query.filter(apps::public.eq(public))
        }

        let apps = query
            .load::<App>(&conn)
            .map_err(|e| ServiceError::InternalServerError( format!("Failed to get apps {}",e)))?;

        Ok(apps)
    }

    pub fn create(
        pool: &DbPool,
        new_app: CreateAppDTO,
    ) -> Result<App, ServiceError> {
        let conn = pool.get().unwrap();
        let app = App::from(new_app);
        let result = diesel::insert_into(apps::table)
            .values(app)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to create dataset {}", e)))?;
        Ok(result)
    }

    pub fn update(
        pool: &DbPool,
        id: Uuid,
        update: UpdateAppDTO,
    ) -> Result<App, ServiceError> {
        let conn = pool.get().unwrap();
        let result = diesel::update(apps::table)
            .filter(apps::id.eq(id))
            .set(update)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to update dashboard {}", e)))?;
        Ok(result)
    }

    pub fn delete(pool: &DbPool, id: Uuid) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::delete(apps::table.filter(apps::id.eq(id)))
            .execute(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to delete dataset {}", e)))?;
        Ok(())
    }

    pub fn find(pool: &DbPool, id: Uuid) -> Result<App, ServiceError> {
        let conn = pool.get().unwrap();
        let app = apps::table
            .filter(apps::id.eq(id))
            .first(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("failed to find dataset {} ", e)))?;
        Ok(app)
    }
}
