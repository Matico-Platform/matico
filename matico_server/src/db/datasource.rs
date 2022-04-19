use async_trait::async_trait;

use crate::{errors::ServiceError, models::User};

#[async_trait]
pub trait DataSource<T>{
    /// Sets up a new user with a domain within the datasource
    async fn setup_user(pool: &T, user: &User) -> Result<(), ServiceError>;
    
    /// Should perform any setup on the datasource
    async fn setup(pool:&T)->Result<(),ServiceError>;
}
