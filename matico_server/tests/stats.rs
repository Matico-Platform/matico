mod helpers;
use helpers::{spawn_app, signup_user, upload_file, get_stat};

use serde_json::Value;
use serde_json::json;

#[actix_web::test]
async fn test_jenks_stat_on_dataset() { 
    let test_server = spawn_app().await; 
    let url = test_server.url("/datasets"); 
    let user = signup_user( 
        "test.test@test.com", 
        "test", 
        "passwword", 
        &test_server.address, 
    ) 
    .await 
    .expect("Failed to create user"); 
 
    let metadata = json!({
        "name": "test dataset",
        "description":"Some dataset that we are testing with",
        "geom_col":"wkb_geometry",
        "id_col":"id",
        "public":false,
        "import_params":{
            "GeoJson":{}
        }
    });

    let file_upload_result = upload_file( 
        "resources/test/geojson_data.geojson", 
        &url, 
        metadata.to_string(), 
        Some(&user.token), 
    ) 
    .await 
    .unwrap();

    let dataset_body: Value = file_upload_result.json().await.unwrap();

    let stat_params = json!({
        "type":"jenks",
        "noBins":3_i32
    });
    
    let result = get_stat(
        dataset_body["id"].as_str().unwrap(), 
        "numbers", 
        &stat_params.to_string(), 
        &test_server.url("/data"), 
        Some(&user.token)
        ).await.unwrap();
    let result_json: Value = result.json().await.unwrap();
    println!("{}", result_json);
}