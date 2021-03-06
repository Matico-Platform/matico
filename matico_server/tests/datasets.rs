mod helpers;
use helpers::{signup_user, spawn_app, upload_file};
use serde_json::json;

#[actix_web::test]
async fn get_datasets_logged_out() {
    let test_server = spawn_app().await;
    println!("Test server address {}", test_server.address);
    let url = test_server.url("/datasets");

    let metadata = json!({
        "name": "test_dataset",
        "description":"Some dataset that we are testing with",
        "geom_col":"wkb_geometry",
        "id_col":"id",
        "import_params":{
            "GeoJson":{}
        }
    });
    let file_upload_result = upload_file(
        "resources/test/geojson_data.geojson",
        &url,
        metadata.to_string(),
        None,
    )
    .await
    .unwrap();

    assert!(!file_upload_result.status().is_success());
}
