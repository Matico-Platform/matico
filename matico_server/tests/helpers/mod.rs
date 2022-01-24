use matico_server::app_config::Config;
use sqlx::postgres::{PgPoolOptions};
use diesel::pg::{PgConnection};
use std::net::TcpListener;
use std::path::PathBuf;
use uuid::Uuid;
use diesel::RunQueryDsl;
use diesel::prelude::*;
use dotenv;

pub mod users;
pub use users::*;

pub struct TestApp {
    pub address: String,
    pub db: sqlx::PgPool,
    pub data_db: sqlx::PgPool,
    pub db_connection_url: String,
    pub data_db_connection_url: String,
    pub db_name:String,
    pub data_db_name: String
}

pub async fn setup_dbs(config: &Config)->(String, String, String, String){

    // Create connection strings for a new testing metadata database
    let random_metadata_database_name = Uuid::new_v4().to_string();
    let base_metadata_connection_string = config.connection_string_without_db().unwrap();

    // Create connection strings for a new testing data database
    let random_data_database_name = Uuid::new_v4().to_string();
    let base_data_connection_string =  config.data_connection_string_without_db().unwrap();


    let metadata_conn= PgConnection::establish(&base_metadata_connection_string)
        .expect("Failed to connect to the metadata db to create test db");


    diesel::sql_query(format!("CREATE DATABASE \"{}\"", random_metadata_database_name))
        .execute(&metadata_conn)
        .expect("Failed to create temporary metadata database");

    let data_conn = PgConnection::establish(&base_data_connection_string)
        .expect("Failed to connect to the data db to create test db");

    diesel::sql_query(format!("CREATE DATABASE \"{}\"", random_data_database_name))
        .execute(&data_conn)
        .expect("Failed to create temporary data database");

    (base_metadata_connection_string, random_metadata_database_name, base_data_connection_string, random_data_database_name)

}

impl Drop for TestApp{
    fn drop(&mut self){
        let db_conn = PgConnection::establish(&self.db_connection_url).expect("Failed to connect to temp meta db to destroy");
        let data_db_conn = PgConnection::establish(&self.db_connection_url).expect("Failed to connect to temp meta db to destroy");

         let disconnect_users = format!(
            "SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '{}';",
            self.db_name
        );

        diesel::sql_query(disconnect_users.as_str())
            .execute(&db_conn)
            .unwrap();

         let disconnect_users = format!(
            "SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '{}';",
            self.data_db_name
        );
         
        diesel::sql_query(disconnect_users.as_str())
            .execute(&data_db_conn)
            .unwrap();

        diesel::sql_query(format!("DROP DATABASE \"{}\"", self.db_name)).execute(&db_conn).expect("Failed to destroy DB");
        diesel::sql_query(format!("DROP DATABASE \"{}\"", self.data_db_name)).execute(&data_db_conn).expect("Failed to destroy DATA DB");
    }
}

pub async fn spawn_app() -> TestApp {
    dotenv::dotenv().ok();
    std::env::set_var("TEST_ENV", "true");

    let mut config = Config::from_conf().unwrap();
    
    let (db_connection_url, db_name, data_db_connection_url, data_db_name) =setup_dbs(&config).await;

    //Connect to the metadata db


    let db_pool = PgPoolOptions::new()
        .connect(&format!("{}/{}",db_connection_url, db_name))
        .await
        .expect("FAiled to connect to DB");

    //Connect to the dataset db
    let data_pool = PgPoolOptions::new()
        .connect(&format!("{}/{}",data_db_connection_url, data_db_name))
        .await
        .expect("FAiled to connect to DB");

    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind to random port ");
    let port = listener.local_addr().unwrap().port();

    config.db.name = db_name.clone();
    config.datadb.name = data_db_name.clone();

    // env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let server = matico_server::run(listener, config)
        .await
        .expect("failed to start server");
    let _ = tokio::spawn(server);

    TestApp {
        address: format!("http://127.0.0.1:{}", port),
        db: db_pool.clone(),
        data_db: data_pool.clone(),
        db_connection_url: db_connection_url,
        db_name: db_name,
        data_db_connection_url: data_db_connection_url,
        data_db_name: data_db_name
    }
}

pub async fn upload_file(file_path: &str, url: &str, metadata: String, token: Option<&str>) -> Result<reqwest::Response, reqwest::Error>{

    let client = reqwest::Client::new();
    let mut test_file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    test_file_path.push(file_path);

    let reader : Vec<u8> = std::fs::read(test_file_path).expect("Failed to load the file to upload");

    let part = reqwest::multipart::Part::stream(reader).file_name("file.geojson");

    let form = reqwest::multipart::Form::new()
                   .text("metadata",metadata)
                   .part("file", part);


    let mut request = client 
        .post(url)
        .multipart(form);

    if let Some(token) = token{
        request = request.bearer_auth(token)
    }
    request.send().await
}
