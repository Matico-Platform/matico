use crate::db::DbPool;
use crate::errors::ServiceError;
use crate::schema::users;
use argon2::{self, Config};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use jsonwebtoken::{EncodingKey, Header};
use rand::Rng;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use uuid::Uuid;
use validator::Validate;

static ONE_WEEK: i64 = 60 * 60 * 24 * 7;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, TS)]
#[table_name = "users"]
#[ts(export)]
pub struct User {
    #[ts(type = "string")]
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize, AsChangeset, TS, Validate)]
#[table_name = "users"]
#[ts(export)]
pub struct SignupDTO {
    #[validate(length(min = 2))]
    pub username: String,
    #[validate(length(min = 5))]
    pub password: String,
    #[validate(email)]
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    exp: usize,
    id: usize,
    username: String,
    image_url: String,
}

impl From<SignupDTO> for User {
    fn from(user: SignupDTO) -> Self {
        User {
            id: Uuid::new_v4(),
            email: user.email,
            username: user.username,
            password: user.password,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        }
    }
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LoginDTO {
    email: String,
    password: String,
}

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct LoginResponseDTO {
    pub user: User,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct SignupResponseDTO {
    pub user: User,
    pub token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserToken {
    pub iat: i64,
    pub exp: i64,
    pub username: String,
    pub id: Uuid,
}

impl From<&User> for UserToken {
    fn from(user: &User) -> Self {
        let now = chrono::Utc::now().timestamp_nanos() / 1_000_000_000;
        Self {
            iat: now,
            exp: now + ONE_WEEK,
            username: user.username.clone(),
            id: user.id,
        }
    }
}

impl UserToken {
    pub fn token(&self) -> String {
        jsonwebtoken::encode(
            &Header::default(),
            self,
            &EncodingKey::from_secret("secret".as_ref()),
        )
        .unwrap()
    }
}

impl User {

    pub fn from_token(pool:&DbPool, token: &Option<UserToken>)->Option<User>{
        if let Some(t) = token{
            Self::find_by_id(pool,t.id).ok()
        } 
        else{
            None
        }
    }

    pub fn create(pool: &DbPool, user: SignupDTO) -> Result<User, ServiceError> {
        let conn = pool.get().unwrap();

        let mut user = User::from(user);
        user.hash_password()?;
        let user = diesel::insert_into(users::table)
            .values(user)
            .get_result(&conn)
            .map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to create user {}", e))
            })?;
        Ok(user)
    }

    pub fn find_by_username(pool: &DbPool, username: String) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();

        let user = users::table
            .filter(users::username.eq(username))
            .first(&conn)
            .map_err(|_| ServiceError::BadRequest("No user with that name".into()))?;
        Ok(user)
    }

    pub fn find_by_email(pool: &DbPool, email: String) -> Result<Self, ServiceError> {
        let conn = pool.get().unwrap();

        let user = users::table
            .filter(users::email.eq(email))
            .first(&conn)
            .map_err(|_| ServiceError::BadRequest("No user with that name".into()))?;
        Ok(user)
    }

    pub fn find_by_id(pool: &DbPool, id: Uuid) -> Result<User, ServiceError> {
        let conn = pool.get().unwrap();
        let user = users::table
            .filter(users::id.eq(id))
            .first(&conn)
            .map_err(|_| ServiceError::BadRequest("Could not find user".into()))?;
        Ok(user)
    }

    pub fn verify(pool: &DbPool, login_details: LoginDTO) -> Result<User, ServiceError> {
        let user = User::find_by_email(pool, login_details.email)?;
        let ok = user.verify_password(&login_details.password)?;
        println!("Test is {}", ok);
        match ok {
            true => Ok(user),
            false => Err(ServiceError::BadRequest("Incorrect Password".into())),
        }
    }

    fn verify_password(&self, password: &str) -> Result<bool, ServiceError> {
        println!("Verifying password {}", password);
        argon2::verify_encoded(&self.password, (*password).as_bytes())
            .map_err(|_| ServiceError::BadRequest("Failed to verify password".into()))
    }

    fn hash_password(&mut self) -> Result<(), ServiceError> {
        let salt: [u8; 32] = rand::thread_rng().gen();
        let config = Config::default();
        self.password =
            argon2::hash_encoded(self.password.as_bytes(), &salt, &config).map_err(|e| {
                ServiceError::InternalServerError(format!("Failed to hash passowrd {}", e))
            })?;
        Ok(())
    }

    pub fn generate_token(&self) -> String {
        let ut: UserToken = UserToken::from(self);
        ut.token()
    }
}
