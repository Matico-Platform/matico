use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::schema::permissions;
use chrono::{NaiveDateTime, Utc};
use derive_more::Display;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::From;
use std::str::FromStr;
use uuid::Uuid;

#[derive(PartialEq, Debug, Display, Serialize, Deserialize)]
pub enum PermissionType {
    #[display(fmt = "READ")]
    READ,
    #[display(fmt = "WRITE")]
    WRITE,
    #[display(fmt = "ADMIN")]
    ADMIN,
}

impl FromStr for PermissionType {
    type Err = ServiceError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "READ" => Ok(Self::READ),
            "WRITE" => Ok(Self::WRITE),
            "ADMIN" => Ok(Self::ADMIN),
            _ => Err(ServiceError::InternalServerError(format!(
                "Unknown Permision Type {}",
                s
            ))),
        }
    }
}

#[derive(PartialEq, Debug, Display, Serialize, Deserialize, Clone)]
pub enum ResourceType {
    #[display(fmt = "DATASET")]
    DATASET,
    #[display(fmt = "APP")]
    APP,
    #[display(fmt = "QUERY")]
    QUERY,
}

impl FromStr for ResourceType {
    type Err = ServiceError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "APP" => Ok(Self::APP),
            "DATASET" => Ok(Self::DATASET),
            "QUERY" => Ok(Self::QUERY),
            _ => Err(ServiceError::InternalServerError(format!(
                "Unknown Resource Type {}",
                s
            ))),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NewPermission {
    pub user_id: Uuid,
    pub resource_id: Uuid,
    pub permission: PermissionType,
    pub resource_type: ResourceType,
}

impl From<NewPermission> for Permission {
    fn from(new_permission: NewPermission) -> Self {
        let permission: String = new_permission.permission.to_string();
        let resource_type: String = new_permission.resource_type.to_string();
        Self {
            id: Uuid::new_v4(),
            user_id: new_permission.user_id,
            resource_id: new_permission.resource_id,
            resource_type,
            permission,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}

#[derive(Debug, Queryable, Deserialize, Serialize, Insertable)]
pub struct Permission {
    pub id: Uuid,
    pub user_id: Uuid,
    pub resource_id: Uuid,
    pub permission: String,
    pub resource_type: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl Permission {
    // Check to see if a user has all the specified permissions for a particular resouce
    pub fn check_all_permissions(
        db: &DbPool,
        user_id: &Uuid,
        resource_id: &Uuid,
        permissions: &Vec<PermissionType>,
    ) -> Result<bool, ServiceError> {
        let user_permissions = Permission::get_permissions(db, user_id, resource_id)?;
        let allowed_types: Vec<PermissionType> = user_permissions
            .iter()
            .map(|user_permission| PermissionType::from_str(&user_permission.permission))
            .collect::<Result<Vec<PermissionType>, ServiceError>>()?;
        let passed = permissions
            .iter()
            .all(|permission| allowed_types.contains(permission));
        Ok(passed)
    }
    // Check permisions and throw service error if they dont match
    pub fn require_permissions(
        db: &DbPool,
        user_id: &Uuid,
        resource_id: &Uuid,
        permissions: &Vec<PermissionType>,
    ) -> Result<(), ServiceError> {
        let check_result = Self::check_all_permissions(db, user_id, resource_id, permissions)?;
        match check_result {
            true => Ok(()),
            false => Err(ServiceError::Unauthorized(format!(
                "User lacks one of the following permisions {:?}",
                permissions
            ))),
        }
    }

    // Check to see if a user has a specific permission for a given resource.
    pub fn check_permission(
        db: &DbPool,
        user_id: &Uuid,
        resource_id: &Uuid,
        permission: PermissionType,
    ) -> Result<bool, ServiceError> {
        Permission::check_all_permissions(db, user_id, resource_id, &vec![permission])
    }

    // Return the permissions a user has for a given resouce
    pub fn get_permissions(
        db: &DbPool,
        user_id: &Uuid,
        resource_id: &Uuid,
    ) -> Result<Vec<Permission>, ServiceError> {
        let conn = db.get().unwrap();
        let user_permissions = permissions::table
            .filter(permissions::user_id.eq(user_id))
            .filter(permissions::resource_id.eq(resource_id))
            .get_results(&conn)
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to get permisions from db {}", e))
            })?;
        Ok(user_permissions)
    }

    // Grants a permission for a specific resource
    pub fn grant_permission(
        db: &DbPool,
        new_permission: NewPermission,
    ) -> Result<Permission, ServiceError> {
        let conn = db.get().unwrap();
        let permission = Permission::from(new_permission);
        let result = diesel::insert_into(permissions::table)
            .values(permission)
            .get_result(&conn)
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to grant permission {}", e))
            })?;
        Ok(result)
    }

    pub fn grant_permissions(
        db: &DbPool,
        user_id: Uuid,
        resource_id: Uuid,
        resource_type: ResourceType,
        permissions: Vec<PermissionType>,
    ) -> Result<(), ServiceError> {
        for permission in permissions {
            let new_permision = NewPermission {
                user_id,
                resource_id,
                resource_type: resource_type.clone(),
                permission,
            };

            Self::grant_permission(db, new_permision)?;
        }
        Ok(())
    }

    pub fn get_permissions_for_user(
        db: &DbPool,
        user_id: &Uuid,
        resource_type: Option<ResourceType>,
        permission_type: Option<PermissionType>,
    ) -> Result<Vec<Permission>, ServiceError> {
        let conn = db.get().unwrap();
        let mut query = permissions::table.into_boxed();
        query = query.filter(permissions::dsl::user_id.eq(user_id));

        if let Some(resource) = resource_type {
            query = query.filter(permissions::dsl::resource_type.eq(resource.to_string()))
        };

        if let Some(permission_t) = permission_type {
            query = query.filter(permissions::dsl::permission.eq(permission_t.to_string()))
        };

        let permissions = query.get_results(&conn).map_err(|_| {
            ServiceError::InternalServerError(format!(
                "Failed to get permissions for user {}",
                user_id
            ))
        })?;

        Ok(permissions)
    }

    // Revoke permission for a specific resource
    pub fn revoke_permission(
        db: &DbPool,
        user_id: &Uuid,
        resource_id: &Uuid,
        permission: PermissionType,
    ) -> Result<(), ServiceError> {
        let conn = db.get().unwrap();

        diesel::delete(permissions::table)
            .filter(permissions::user_id.eq(user_id))
            .filter(permissions::resource_id.eq(resource_id))
            .filter(permissions::permission.eq(permission.to_string()))
            .execute(&conn)
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to remove permision {}", e))
            })?;

        Ok(())
    }
}
