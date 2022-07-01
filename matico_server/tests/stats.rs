async fn upload_json_dataset_logged_in_with_bad_metadata() { 
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
 
    let file_upload_result = upload_file( 
        "resources/test/geojson_data.geojson", 
        &url, 
        "{}".into(), 
        Some(&user.token), 
    ) 
    .await 
    .unwrap();  
}

// async fn jenks_test() {
//     let file = upload_json_dataset_logged_in_with_bad_metadata();
//     let db = "/datasets";
//     let col = "numbers";
//     let stat_params = StatParams::Jenks;
//     let query = // Finish this

//     calculate_jenks(&db, &col, &stat_params, &query);
// }