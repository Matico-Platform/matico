mod helpers;
use helpers::{users::*, *};

#[actix_rt::test]
async fn user_signs_up() {
    let test_server = spawn_app().await;

    let response = signup_user(
        "test_user@gmail.com",
        "test_user",
        "password",
        test_server.address,
    )
    .await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(response.token.len() > 0);
}

#[actix_rt::test]
async fn sign_up_user_without_password() {
    let test_server = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "test_user", "", test_server.address).await;

    assert!(response.is_err());
}

#[actix_rt::test]
async fn sign_up_user_without_username() {
    let test_server = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "", "password", test_server.address).await;

    assert!(response.is_err());
}

#[actix_rt::test]
async fn sign_up_user_without_email() {
    let test_server = spawn_app().await;

    let response = signup_user("", "username", "password", test_server.address).await;

    assert!(response.is_err());
}
