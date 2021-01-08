use crate::schema::*;
use serde::{Deserialize,Serialize};
use chrono::NaiveDateTime;

#[derive(Debug,Serialize,Deserialize,Queryable)]
pub struct User{
    pub id: i32,
    pub username: String,
    pub created_at: NaiveDateTime
}

#[derive(Insertable,Debug)]
#[table_name = "users"]
pub struct NewUser<'a>{
    pub username: &'a str,
    pub created_at: NaiveDateTime
}