mod helpers;
use sqlx::Row;
use helpers::{spawn_app, signup_user, upload_file};
use serde_json::{json,Value};
use sqlx::postgres::PgRow;
use chrono::{DateTime,Utc};

#[actix_rt::test]
async fn upload_json_dataset_logged_in_with_bad_metadata(){
    let test_server = spawn_app().await;
    let url = test_server.url("/datasets");
    let user = signup_user("test.test@test.com", "test", "passwword", &test_server.address).await.expect("Failed to create user");
    
    let file_upload_result = upload_file("resources/test/geojson_data.geojson", &url,"{}".into(), Some(&user.token)).await.unwrap();
    assert!(!file_upload_result.status().is_success(), "Tried to upload geojson with bad metadata and it did not fail");
}

#[actix_rt::test]
async fn upload_json_dataset_logged_in_good_metadata(){
    let test_server = spawn_app().await;
    let url = test_server.url("/datasets");
    let user = signup_user("test.test@test.com", "test", "passwword", &test_server.address).await.expect("Failed to create user");

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

    let file_upload_result = upload_file("resources/test/geojson_data.geojson", &url,metadata.to_string(), Some(&user.token)).await.unwrap();

    assert!(file_upload_result.status().is_success(), "Tried to upload geojson with good metadata and it failed");
    
    let dataset_body : Value = file_upload_result.json().await.unwrap();

    assert_eq!(dataset_body["owner_id"], user.user.id.to_string(), "Owner id doesn't match the user who uploaded the dataset");
    assert_eq!(dataset_body["name"], "test dataset", "The name of the dataset should be the one we specified");
    assert_eq!(dataset_body["table_name"], "test_dataset", "The name of the dataset should be the one we specified");
    assert_eq!(dataset_body["description"], "Some dataset that we are testing with", "The description of the dataset should be the one we specified");
    assert_eq!(dataset_body["sync_dataset"], false, "This should not be a sync dataset");
    assert_eq!(dataset_body["public"], false, "This dataset should not be public");
    assert_eq!(dataset_body["geom_col"], "wkb_geometry", "The geom_col should be correct");
    assert_eq!(dataset_body["id_col"], "id", "The id col should be correct");


    let query = format!("select category_vars, parseable_numbers, numerical_categorical, numbers, dates from {} limit 1", dataset_body["table_name"]);
    let result: Result<(String,String, i32, f64, DateTime<Utc>),_> = sqlx::query(&query)
        .map(|row: PgRow| (
            row.get("category_vars"), 
            row.get("parseable_numbers"), 
            row.get("numerical_categorical"), 
            row.get("numbers"), 
            row.get("dates")))
        .fetch_one(&test_server.data_db)
        .await;

    assert!(result.is_ok(), "We should get back the correct column types : {:#?}", result); 
    
    // Check the geometry

    let query = format!("select ST_GeometryType(wkb_geometry) as geom_type from {} ", dataset_body["table_name"]);
    let result: Result<String,_> = sqlx::query(&query)
        .map(|row: PgRow| row.get("geom_type"))
        .fetch_one(&test_server.data_db)
        .await;
          
    assert!(result.is_ok(), "Should get a valid geometry on query");
    assert_eq!(String::from("ST_Point"), result.unwrap(), "Should get a Point geometry back");
}

#[actix_rt::test]
async fn upload_csv_dataset_logged_in_good_metadata_lat_lng(){
    let test_server = spawn_app().await;
    let url = test_server.url("/datasets");
    let user = signup_user("test.test@test.com", "test", "passwword", &test_server.address).await.expect("Failed to create user");

    let metadata = json!({
        "name": "test dataset",
        "description":"Some dataset that we are testing with",
        "geom_col":"wkb_geometry",
        "id_col":"id",
        "public":false, 
        "import_params":{
            "Csv":{
                "x_col":"lngs",
                "y_vol":"lats",
                "crs":"EPSG:4326"
            }
        }
    }); 

    let file_upload_result = upload_file("resources/test/csv_data_with_lat_lng.csv", &url,metadata.to_string(), Some(&user.token)).await.unwrap();

    assert!(file_upload_result.status().is_success(), "Tried to upload csv with good metadata and it failed {:#?}", file_upload_result.text().await.unwrap());
    
    let dataset_body : Value = file_upload_result.json().await.unwrap();

    assert_eq!(dataset_body["owner_id"], user.user.id.to_string(), "Owner id doesn't match the user who uploaded the dataset");
    assert_eq!(dataset_body["name"], "test dataset", "The name of the dataset should be the one we specified");
    assert_eq!(dataset_body["table_name"], "test_dataset", "The name of the dataset should be the one we specified");
    assert_eq!(dataset_body["description"], "Some dataset that we are testing with", "The description of the dataset should be the one we specified");
    assert_eq!(dataset_body["sync_dataset"], false, "This should not be a sync dataset");
    assert_eq!(dataset_body["public"], false, "This dataset should not be public");
    assert_eq!(dataset_body["geom_col"], "wkb_geometry", "The geom_col should be correct");
    assert_eq!(dataset_body["id_col"], "id", "The id col should be correct");


    let query = format!("select category_vars, parseable_numbers, numerical_categorical, numbers, dates from {} limit 1", dataset_body["table_name"]);
    let result: Result<(String,String, i32, f64, DateTime<Utc>),_> = sqlx::query(&query)
        .map(|row: PgRow| (
            row.get("category_vars"), 
            row.get("parseable_numbers"), 
            row.get("numerical_categorical"), 
            row.get("numbers"), 
            row.get("dates")))
        .fetch_one(&test_server.data_db)
        .await;

    assert!(result.is_ok(), "We should get back the correct column types"); 
    
    // Check the geometry

    let query = format!("select ST_GeometryType(wkb_geometry) as geom_type from {} ", dataset_body["table_name"]);
    let result: Result<String,_> = sqlx::query(&query)
        .map(|row: PgRow| row.get("geom_type"))
        .fetch_one(&test_server.data_db)
        .await;
          
    assert!(result.is_ok(), "Should get a valid geometry on query");
    assert_eq!(String::from("ST_Point"), result.unwrap(), "Should get a Point geometry back");
}

#[actix_rt::test]
async fn upload_json_dataset_logged_out_good_metadata(){
    let test_server = spawn_app().await;
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

    let file_upload_result = upload_file("resources/test/geojson_data.geojson", &url,metadata.to_string(), None).await.unwrap();
    assert!(!file_upload_result.status().is_success(), "Tried to upload a valid dataset logged out and it succeded");
}
