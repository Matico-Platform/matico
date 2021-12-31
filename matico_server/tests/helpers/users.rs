use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct SignupResponse {
    pub user: UserResponse,
    pub token: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SignupRequest {
    pub username: String,
    pub password: String,
    pub email: String,
}

pub async fn signup_user(
    email: &str,
    username: &str,
    password: &str,
    base_url: String,
) -> Result<SignupResponse, ()> {
    let client = reqwest::Client::new();
    let request = SignupRequest {
        username: String::from(username),
        password: String::from(password),
        email: String::from(email),
    };
    println!("Attempting to signup user {:?}", request);
    let response = client
        .post(&format!("{}/api/auth/signup", base_url))
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .json(&request)
        .send()
        .await
        .expect("Signup failed");

    if response.status().is_success() {
        let user: SignupResponse = response
            .json()
            .await
            .expect("failed to parse json response");
        Ok(user)
    } else {
        let text = response.text().await.unwrap();
        println!(" FAiled to deserialize json, text was {}", text);
        Err(())
    }
}
