mod helpers;
use actix::fut::future::result;
use helpers::{spawn_app, signup_user, upload_file, get_stat};

use reqwest::StatusCode;
use serde::Deserialize;
use serde::Serialize;
use serde_json::Value;
use serde_json::json;

use matico_server::models::stats::JenksEntry;

#[derive(Deserialize,Debug)]
struct QueryError{
    pub query:Option<String>,
    pub full_query:Option<String>,
    pub error:String
}

#[derive(Deserialize)]
struct JenksResult{
  jenks: Vec<JenksEntry>
}

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
        "noBins":5_i32
    });
    
    let result = get_stat(
        dataset_body["id"].as_str().unwrap(), 
        "numbers", 
        &test_server.url("/data"), 
        &stat_params.to_string(), 
        Some(&user.token)
        ).await;

    assert!(result.is_ok() ,  "Query should not fail");
    let result = result.unwrap();

    // // Debugging
    // let result_status = resxult.status();
    // println!("Result status code is {}",result_status);
    // if result_status != StatusCode::OK{
    //     let error: QueryError= result.json().await.unwrap();
    //     println!("result is {:#?}\n\n",error);
    //     println!("Query was {}", error.full_query.unwrap());
    //     assert!(false,"Result status was not ok");
    // }
    // else {
    //     let result: Value= result.json().await.unwrap();
    //     println!("Result was {:#}",result);
    // }

    let result: JenksResult = result.json().await.unwrap();
    let bins: Vec<JenksEntry> = result.jenks;
   
    // Test if number of bins is correct
    assert_eq!(stat_params["noBins"], bins.len(), "Wrong number of bins in output");

    // Test if bin bounds match
    for i in 0 .. stat_params["noBins"].as_u64().unwrap() - 1 {
        assert!(bins[i as usize].bin_end == bins[(i + 1) as usize].bin_start, "Bin bounds don't match");
    }

    // Test if total number of data points is correct
    let mut count: usize = 0;
    for bin in bins {
        count += bin.freq as usize;
    }
    assert!(count == 20, "Number of data points is incorrect");

}