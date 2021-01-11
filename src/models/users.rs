use crate::schema::*;
use serde::{Deserialize,Serialize};
use chrono::NaiveDateTime;
use bcrypt::{hash,verify,DEFAULT_COST};

#[derive(Debug,Serialize,Deserialize,Queryable)]
pub struct User{
    pub id: i32,
    pub username: String,
    pub password: String,
    pub created_at: NaiveDateTime
}

#[derive(Insertable,Debug)]
#[table_name = "users"]
pub struct NewUser<'a>{
    pub username: &'a str,
    pub created_at: NaiveDateTime,
    pub password: &'a str
}

#[derive(Debug,Serialize,Deserialize)]
struct Claims{
    exp: usize,
    id: usize,
    username: String,
    image_url: String
}


impl User{
    fn validate_password(&self, password_attempt: &str)->bool{
        verify(password_attempt, &self.password)
    }
}