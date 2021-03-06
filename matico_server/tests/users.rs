mod helpers;
use helpers::{users::*, *};

#[actix_web::test]
async fn user_signs_up() {
    let test_server = spawn_app().await;

    println!("Test server address {}", test_server.address);
    let response = signup_user(
        "test_user@gmail.com",
        "test_user",
        "password",
        &test_server.address,
    )
    .await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(!response.token.is_empty());
}

#[actix_web::test]
async fn should_not_allow_duplicate_emails() {
    let test_server = spawn_app().await;

    let response = signup_user(
        "test_user@gmail.com",
        "test_user",
        "password",
        &test_server.address,
    )
    .await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(!response.token.is_empty());

    let response = signup_user(
        "test_user@gmail.com",
        "test_user2",
        "password",
        &test_server.address,
    )
    .await;

    assert!(response.is_err());
}

#[actix_web::test]
async fn should_not_allow_duplicate_usernames() {
    let test_server = spawn_app().await;

    let response = signup_user(
        "test_user@gmail.com",
        "test_user",
        "password",
        &test_server.address,
    )
    .await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(!response.token.is_empty());

    let response = signup_user(
        "test_user@gmail.com",
        "test_user2",
        "password",
        &test_server.address,
    )
    .await;

    assert!(response.is_err());
}

#[actix_web::test]
async fn sign_up_user_without_password() {
    let test_server = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "test_user", "", &test_server.address).await;

    assert!(response.is_err());
}

#[actix_web::test]
async fn sign_up_user_without_username() {
    let test_server = spawn_app().await;

    let response = signup_user("test_user@gmail.com", "", "password", &test_server.address).await;

    assert!(response.is_err());
}

#[actix_web::test]
async fn sign_up_user_without_email() {
    let test_server = spawn_app().await;

    let response = signup_user("", "username", "password", &test_server.address).await;

    assert!(response.is_err());
}
