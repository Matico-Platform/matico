use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::models::map_style::MapStyle;
use crate::schema::dashboards;
use crate::utils::PaginationParams;

use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::From;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Queryable, Insertable)]
#[table_name = "dashboards"]
pub struct Dashboard {
    pub id: Uuid,
    pub name: String,
    pub owner_id: Uuid,
    pub description: String,
    pub map_style: MapStyle,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateDashboardDTO {
    pub name: String,
    pub owner_id: Option<Uuid>,
    pub description: String,
    pub map_style: MapStyle,
    pub public: bool,
}

#[derive(Serialize, Deserialize, Debug, AsChangeset)]
#[table_name = "dashboards"]
pub struct UpdateDashboardDTO {
    pub name: Option<String>,
    pub description: Option<String>,
    pub map_style: Option<MapStyle>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DashboardSearch {
    pub name: Option<String>,
    pub description: Option<String>,
    pub user_id: Option<Uuid>,
    pub public: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct DashboardOrderBy {
    field: Option<String>,
}

impl From<CreateDashboardDTO> for Dashboard {
    fn from(dashboard: CreateDashboardDTO) -> Self {
        Dashboard {
            id: Uuid::new_v4(),
            name: dashboard.name,
            description: dashboard.description,
            map_style: dashboard.map_style,
            public: dashboard.public,
            owner_id: dashboard.owner_id.unwrap(),
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}

impl Dashboard {
    pub fn search(
        pool: &DbPool,
        _order: DashboardOrderBy,
        search: DashboardSearch,
        _page: Option<PaginationParams>,
    ) -> Result<Vec<Dashboard>, ServiceError> {
        let conn = pool.get().unwrap();
        let mut query = dashboards::table.into_boxed();

        if let Some(name) = search.name {
            query = query.filter(dashboards::name.like(name))
        }

        if let Some(desc) = search.description {
            query = query.filter(dashboards::description.like(desc))
        }

        if let Some(user_id) = search.user_id {
            query = query.filter(dashboards::owner_id.eq(user_id))
        }

        if let Some(public) = search.public {
            query = query.filter(dashboards::public.eq(public))
        }

        let dashboards = query.load::<Dashboard>(&conn).map_err(|e| {
            ServiceError::InternalServerError(format!("Failed to get dashboards {}", e))
        })?;

        Ok(dashboards)
    }

    pub fn create(
        pool: &DbPool,
        new_dashboard: CreateDashboardDTO,
    ) -> Result<Dashboard, ServiceError> {
        let conn = pool.get().unwrap();
        let dataset = Dashboard::from(new_dashboard);
        let result = diesel::insert_into(dashboards::table)
            .values(dataset)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to create dataset {}", e)))?;
        Ok(result)
    }

    pub fn update(
        pool: &DbPool,
        id: Uuid,
        update: UpdateDashboardDTO,
    ) -> Result<Dashboard, ServiceError> {
        let conn = pool.get().unwrap();
        let result = diesel::update(dashboards::table)
            .filter(dashboards::id.eq(id))
            .set(update)
            .get_result(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to update dashboard {}", e)))?;
        Ok(result)
    }

    pub fn delete(pool: &DbPool, id: Uuid) -> Result<(), ServiceError> {
        let conn = pool.get().unwrap();
        diesel::delete(dashboards::table.filter(dashboards::id.eq(id)))
            .execute(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("Failed to delete dataset {}", e)))?;
        Ok(())
    }

    pub fn find(pool: &DbPool, id: Uuid) -> Result<Dashboard, ServiceError> {
        let conn = pool.get().unwrap();
        let dashboard = dashboards::table
            .filter(dashboards::id.eq(id))
            .first(&conn)
            .map_err(|e| ServiceError::BadRequest(format!("failed to find dataset {} ", e)))?;
        Ok(dashboard)
    }
}
