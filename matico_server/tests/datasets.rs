mod helpers;
use helpers::{spawn_app, signup_user, upload_file};
use serde_json::json;

#[actix_rt::test]
async fn get_datasets_logged_out() {
    let test_server = spawn_app().await;
    let url = format!("{}/api/datasets", test_server.address);

    let metadata = json!({
        "name": "test_dataset",
        "description":"Some dataset that we are testing with",
        "geom_col":"wkb_geometry",
        "id_col":"id",
        "import_params":{
            "GeoJson":{}
        }
    }); 
    let file_upload_result = upload_file("resources/test/squirrel.geojson", &url, metadata.to_string(), None).await.unwrap();

    assert!(!file_upload_result.status().is_success());
}

#[actix_rt::test]
async fn upload_json_dataset_logged_in_with_bad_metadata(){
    let test_server = spawn_app().await;
    let url = format!("{}/api/datasets", test_server.address);
    let user = signup_user("test.test@test.com", "test", "passwword", &test_server.address).await.expect("Failed to create user");
    
    let file_upload_result = upload_file("resources/test/squirrel.geojson", &url,"{}".into(), Some(&user.token)).await.unwrap();
    assert!(!file_upload_result.status().is_success());
}

#[actix_rt::test]
async fn upload_json_dataset_logged_in_good_metadata(){
    let test_server = spawn_app().await;
    let url = format!("{}/api/datasets", test_server.address);
    let user = signup_user("test.test@test.com", "test", "passwword", &test_server.address).await.expect("Failed to create user");

    let metadata = json!({
        "name": "test_dataset",
        "description":"Some dataset that we are testing with",
        "geom_col":"wkb_geometry",
        "id_col":"id",
        "import_params":{
            "GeoJson":{}
        }
    }); 

    let file_upload_result = upload_file("resources/test/squirrel.geojson", &url,metadata.to_string(), Some(&user.token)).await.unwrap();
    assert!(file_upload_result.status().is_success());
}
