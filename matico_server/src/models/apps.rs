use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::{Permission, PermissionType, ResourceType};
use crate::schema::apps;
use crate::utils::PaginationParams;

use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use diesel_as_jsonb::AsJsonb;

use serde::{Deserialize, Serialize};
use std::convert::From;
use ts_rs::TS;
use uuid::Uuid;

#[derive(AsJsonb, Debug, Serialize, Deserialize)]
pub struct AppSpec(matico_spec::Dashboard);

#[derive(Serialize, Deserialize, Debug, Queryable, Insertable, TS)]
#[table_name = "apps"]
#[ts(export)]
pub struct App {
    #[ts(type = "string")]
    pub id: Uuid,
    pub name: String,
    #[ts(type = "string")]
    pub owner_id: Uuid,
    pub description: String,
    #[ts(type = "AppSpec")]
    pub spec: AppSpec,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct CreateAppDTO {
    pub name: String,
    #[ts(type = "string")]
    pub owner_id: Option<Uuid>,
    pub description: String,
    #[ts(type = "AppSpec")]
    pub spec: AppSpec,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset, TS)]
#[table_name = "apps"]
#[ts(export)]
pub struct UpdateAppDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    #[ts(type = "AppSpec")]
    pub spec: Option<AppSpec>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct AppSearch {
    pub name: Option<String>,
    pub description: Option<String>,
    #[ts(type = "string")]
    pub user_id: Option<Uuid>,
    #[ts(type = "string")]
    pub owner_id: Option<Uuid>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct AppOrderBy {
    field: Option<String>,
}

impl From<CreateAppDTO> for App {
    fn from(app: CreateAppDTO) -> Self {
        App {
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

        if let Some(user_id) = search.user_id {
            let permissions = Permission::get_permissions_for_user(
                pool,
                &user_id,
                Some(ResourceType::App),
                Some(PermissionType::Read),
            )?;
            let apps_user_has_permission_for: Vec<Uuid> =
                permissions.iter().map(|p| p.resource_id).collect();
            query = query.filter(
                apps::id
                    .eq_any(apps_user_has_permission_for)
                    .or(apps::public.eq(true)),
            );
        } else {
            query = query.filter(apps::public.eq(true));
        }

        if let Some(name) = search.name {
            query = query.filter(apps::name.like(name))
        }

        if let Some(desc) = search.description {
            query = query.filter(apps::description.like(desc))
        }

        if let Some(user_id) = search.user_id {
            query = query.filter(apps::owner_id.eq(user_id))
        }

        let apps = query
            .load::<App>(&conn)
            .map_err(|e| ServiceError::InternalServerError(format!("Failed to get apps {}", e)))?;

        Ok(apps)
    }

    pub fn create(pool: &DbPool, new_app: CreateAppDTO) -> Result<App, ServiceError> {
        let conn = pool.get().unwrap();
        let app = App::from(new_app);
        let result = diesel::insert_into(apps::table)
            .values(app)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to create dataset {}", e)))?;
        Ok(result)
    }

    pub fn update(pool: &DbPool, id: Uuid, update: UpdateAppDTO) -> Result<App, ServiceError> {
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
