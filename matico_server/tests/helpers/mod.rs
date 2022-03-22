use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::r2d2::ConnectionManager;
use diesel::RunQueryDsl;
use dotenv;
use matico_server::app_config::Config;
use sqlx::postgres::PgPoolOptions;
use std::net::TcpListener;
use uuid::Uuid;

pub type DbPool = r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>;
pub type DataDbPool = sqlx::PgPool;

pub mod imports;
pub mod users;
pub use imports::*;
pub use users::*;

pub struct TestApp {
    pub address: String,
    pub db: DbPool,
    pub data_db: DataDbPool,
    pub db_connection_url: String,
    pub data_db_connection_url: String,
    pub db_name: String,
    pub data_db_name: String,
}

pub async fn setup_dbs(config: &Config) -> (String, String, String, String) {
    // Create connection strings for a new testing metadata database
    let random_metadata_database_name = Uuid::new_v4().to_string();
    let base_metadata_connection_string = config.connection_string_without_db().unwrap();

    // Create connection strings for a new testing data database
    let random_data_database_name = Uuid::new_v4().to_string();
    let base_data_connection_string = config.data_connection_string_without_db().unwrap();

    let metadata_conn = PgConnection::establish(&base_metadata_connection_string)
        .expect("Failed to connect to the metadata db to create test db");

    diesel::sql_query(format!(
        "CREATE DATABASE \"{}\"",
        random_metadata_database_name
    ))
    .execute(&metadata_conn)
    .expect("Failed to create temporary metadata database");

    let data_conn = PgConnection::establish(&base_data_connection_string)
        .expect("Failed to connect to the data db to create test db");

    diesel::sql_query(format!("CREATE DATABASE \"{}\"", random_data_database_name))
        .execute(&data_conn)
        .expect("Failed to create temporary data database");

    let data_conn_database = PgConnection::establish(&format!(
        "{}/{}",
        base_data_connection_string, random_data_database_name
    ))
    .expect("Failed to connect to new data database");

    let postgis_installl_commands = [
        "CREATE EXTENSION postgis;",
        "CREATE EXTENSION postgis_raster;",
        "CREATE EXTENSION postgis_topology;",
    ];

    for command in postgis_installl_commands {
        diesel::sql_query(command)
            .execute(&data_conn_database)
            .expect("Failed to install postgis");
    }
    (
        base_metadata_connection_string,
        random_metadata_database_name,
        base_data_connection_string,
        random_data_database_name,
    )
}

impl Drop for TestApp {
    fn drop(&mut self) {
        let db_conn = PgConnection::establish(&self.db_connection_url)
            .expect("Failed to connect to temp meta db to destroy");
        let data_db_conn = PgConnection::establish(&self.db_connection_url)
            .expect("Failed to connect to temp meta db to destroy");

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

        diesel::sql_query(format!("DROP DATABASE \"{}\"", self.db_name))
            .execute(&db_conn)
            .expect("Failed to destroy DB");
        diesel::sql_query(format!("DROP DATABASE \"{}\"", self.data_db_name))
            .execute(&data_db_conn)
            .expect("Failed to destroy DATA DB");
    }
}

impl TestApp {
    /// A Convenience method for getting the full url of a API path in the test server
    pub fn url(&self, path: &str) -> String {
        format!("{}/api{}", self.address, path)
    }
}

/// Spawn a TestApp to test against. Assigns a random port to the API and sets up
/// a metadata database and a data database with random names
///
/// # Examples
///
/// ```
/// let test_server = spawn_app().await;
///
/// // Get the url of an api endpoint on the test server
/// let api_url = test_server.url("/datasets");
///
/// // Get a connection to the metadata database;
/// let metadata_conn = test_server.db.get().unwrap()
///
/// // Get a connection to the data database;
///
/// let data_conn = test_server.data_db.get().unwrap()
/// ```
pub async fn spawn_app() -> TestApp {
    dotenv::dotenv().ok();
    let mut config = Config::from_conf().unwrap();

    let (db_connection_url, db_name, data_db_connection_url, data_db_name) =
        setup_dbs(&config).await;

    // Connect to the metadata db
    let manager = ConnectionManager::<diesel::pg::PgConnection>::new(db_connection_url.clone());

    // Set up the database pool for the system metadata
    let db_pool = r2d2::Pool::builder()
        .max_size(10)
        .build(manager)
        .expect("Failed to connect to DB");

    // Connect to the dataset db
    let data_pool = PgPoolOptions::new()
        .connect(&format!("{}/{}", data_db_connection_url, data_db_name))
        .await
        .expect("FAiled to connect to DB");

    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind to random port ");
    let port = listener.local_addr().unwrap().port();

    config.db.name = db_name.clone();
    config.datadb.name = data_db_name.clone();

    // Set max connections lower to avoid swamping the 
    // connection pool for concurrent tests
    config.db.max_connections= Some(3);
    config.datadb.max_connections= Some(3);

    // env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let server = matico_server::run(listener, config).await.unwrap();

    let _ = tokio::spawn(server);

    TestApp {
        address: format!("http://127.0.0.1:{}", port),
        db: db_pool.clone(),
        data_db: data_pool.clone(),
        db_connection_url: db_connection_url,
        db_name: db_name,
        data_db_connection_url: data_db_connection_url,
        data_db_name: data_db_name,
    }
}
