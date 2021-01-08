use crate::db::DbPool;
use crate::models::{User,NewUser};
use crate::schema::users::dsl::*;
use crate::diesel::QueryDsl;
use crate::diesel::RunQueryDsl;
use diesel::dsl::{delete,insert_into};
use actix_web::{web};

pub fn get_user_by_id(pool: web::Data<DbPool>,
user_id:i32)->Result<User,diesel::result::Error>{
    let conn = pool.get().unwrap();
    users.find(user_id).get_result::<User>(&conn)
}

pub fn create_user(db: web::Data<DbPool>, new_user: &NewUser)->Result<User,diesel::result::Error>{
    let conn = db.get().unwrap();
    let res  = insert_into(users).values(new_user).get_result(&conn)?;
    Ok(res)
}
