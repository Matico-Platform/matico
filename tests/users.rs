mod helpers;
use helpers::*;

#[actix_rt::test]
async fn user_signs_up() {
    spawn_app().await;

    let response = signup_user("test_user@gmail.com", "test_user", "password").await;

    assert!(response.is_ok());
    let response = response.unwrap();

    assert_eq!(response.user.username, "test_user");
    assert_eq!(response.user.email, "test_user@gmail.com");
    assert!(response.token.len() > 0);
}
