mod helpers;
use helpers::spawn_app;

#[actix_rt::test]
async fn get_datasets_logged_out() {
    spawn_app().await;

    let client = reqwest::Client::new();
    let response = client
        .get("http://localhost:8000/api/datasets")
        .send()
        .await
        .expect("Failed to make the request");

    assert!(response.status().is_success());
}
