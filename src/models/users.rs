use crate::errors::ServiceError;
use crate::db::DbPool;
use crate::schema::users;
use serde::{Deserialize,Serialize};
use chrono::{NaiveDateTime, Utc};
use argon2::{self, Config};
use uuid::Uuid;
use rand::Rng;
use diesel::prelude::*;
use jsonwebtoken::{EncodingKey,Header};

static ONE_WEEK: i64 = 60*60*24*7;


#[derive(Debug,Serialize,Deserialize,Queryable,Insertable)]
#[table_name = "users"]
pub struct User{
    pub id: Uuid,
    pub username: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime
}



#[derive(Serialize, Deserialize, AsChangeset)]
#[table_name = "users"]
pub struct SignupDTO{
    pub username: String,
    pub password: String
}


#[derive(Debug,Serialize,Deserialize)]
struct Claims{
    exp: usize,
    id: usize,
    username: String,
    image_url: String
}

impl From<SignupDTO> for User{
    fn from(user: SignupDTO)->Self{
        User{
            id: Uuid::new_v4(),
            username: user.username,
            password: user.password,
            created_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc()
        }
    }
}

#[derive(Serialize,Deserialize)]
pub struct LoginDTO{
    username: String,
    password: String
}

#[derive(Serialize,Deserialize)]
pub struct LoginResponseDTO{
    pub user:User,
    pub token: String 
}


#[derive(Serialize, Deserialize)]
struct UserToken{
    iat: i64,
    exp: i64,
    username: String,
    id: Uuid 
}

impl From<&User> for UserToken{
    fn from(user: &User)->Self{
        let now = chrono::Utc::now().timestamp_nanos() / 1_000_000_000;
        Self{
            iat: now,
            exp: now + ONE_WEEK,
            username : user.username.clone(),
            id: user.id.clone()
        }
    }
}

impl UserToken{
    pub fn token(&self)->String{
        jsonwebtoken::encode(&Header::default(), self, &EncodingKey::from_secret("secret".as_ref())).unwrap()
    }
}

impl User{
    pub fn create(pool: &DbPool,user: SignupDTO)->Result<User,ServiceError>{
        let conn = pool.get().unwrap();

        let mut user = User::from(user);
        user.hash_password()?;
        let user = diesel::insert_into(users::table)
        .values(user)
        .get_result(&conn)
        .map_err(|e| ServiceError::InternalServerError(format!("Failed to create user {}",e)))?;
        
        Ok(user)
    }

    pub fn find_by_username(pool: &DbPool, email:String)-> Result<Self,ServiceError>{
        let conn = pool.get().unwrap();

        let user = users::table.filter(users::username.eq(email))
            .first(&conn)
            .map_err(|e| ServiceError::BadRequest("No user with that name".into()))?;
        Ok(user)
    }

    pub fn find_by_id(pool: &DbPool, id: Uuid)->Result<User, ServiceError>{
        let conn = pool.get().unwrap();
        let user = users::table.filter(users::id.eq(id))
        .first(&conn)
        .map_err(|e| ServiceError::BadRequest("Could not find user".into()))?;
        Ok(user)
    }

    pub fn verify(pool: &DbPool, login_details: LoginDTO)->Result<User,ServiceError>{
        let user = User::find_by_username(pool, login_details.username)?;
        let ok = user.verify_password(&login_details.password)?;
        println!("Test is {}",ok);
        match ok{
            true => Ok(user),
            false=> Err(ServiceError::BadRequest("Incorrect Password".into()))
        }
    }

    fn verify_password(&self, password: &String)->Result<bool,ServiceError>{
        println!("Verifying password {}", password);
        argon2::verify_encoded(&self.password, (*password).as_bytes())
        .map_err(|e| ServiceError::BadRequest("Failed to verify password".into()))
    }

    fn hash_password(&mut self)->Result<(),ServiceError>{
        let salt: [u8;32] = rand::thread_rng().gen();
        let config = Config::default();
        self.password = argon2::hash_encoded(self.password.as_bytes(), &salt, &config)
        .map_err(|e| ServiceError::InternalServerError(format!("Failed to hash passowrd {}", e)))?;
        Ok(())
    }

    pub fn generate_token(&self)->String{        
        let ut: UserToken = UserToken::from(self);
        ut.token()
    }
}