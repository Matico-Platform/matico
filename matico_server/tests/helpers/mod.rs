
use matico_server::app_config::Config;
use sqlx::postgres::PgPoolOptions;
use std::net::TcpListener;

pub mod users;

pub struct TestApp {
    pub address: String,
    pub db: sqlx::PgPool,
    pub data_db: sqlx::PgPool,
}

pub async fn spawn_app() -> TestApp {
    std::env::set_var("TEST_ENV", "true");

    let config = Config::from_conf().unwrap();

    //Connect to the metadata db
    let db_connection_url = config.data_connection_string().unwrap();
    let db_pool = PgPoolOptions::new()
        .connect(&db_connection_url)
        .await
        .expect("FAiled to connect to DB");

    //Connect to the dataset db
    let data_db_connection_url = config.data_connection_string().unwrap();
    let data_pool = PgPoolOptions::new()
        .connect(&data_db_connection_url)
        .await
        .expect("FAiled to connect to DB");

    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind to random port ");
    let port = listener.local_addr().unwrap().port();

    dotenv::dotenv().ok();
    // env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let server = matico_server::run(listener, config)
        .await
        .expect("failed to start server");
    let _ = tokio::spawn(server);

    TestApp {
        address: format!("http://127.0.0.1:{}", port),
        db: db_pool.clone(),
        data_db: data_pool.clone(),
    }
}
