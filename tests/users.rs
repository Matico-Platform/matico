mod helpers;
use helpers::{users::*, *};

#[actix_rt::test]
async fn user_signs_up() {
    let address = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "test_user", "password", address).await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(response.token.len() > 0);
}

#[actix_rt::test]
async fn sign_up_user_without_password() {
    let address = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "test_user", "", address).await;

    assert!(response.is_err());
}

#[actix_rt::test]
async fn sign_up_user_without_username() {
    let address = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "", "password", address).await;

    assert!(response.is_err());
}

#[actix_rt::test]
async fn sign_up_user_without_email() {
    let address = spawn_app().await;

    let response = signup_user("", "username", "password", address).await;

    assert!(response.is_err());
}
