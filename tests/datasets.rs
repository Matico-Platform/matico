mod helpers;
use helpers::spawn_app;

#[actix_rt::test]
async fn get_datasets_logged_out() {
    let address = spawn_app().await;

    let client = reqwest::Client::new();
    let url = format!("{}/api/datasets", address);
    println!("Featching from {}", url);
    let response = client
        .get(&url)
        .send()
        .await
        .expect("Failed to make the request");

    assert!(response.status().is_success());
}
