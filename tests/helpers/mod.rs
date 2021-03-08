use dotenv;
use std::net::TcpListener;
pub mod users;

struct TestApp {
    address: String,
}

pub async fn spawn_app() -> String {
    std::env::set_var("TEST_ENV", "true");

    let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind to random port ");
    let port = listener.local_addr().unwrap().port();

    dotenv::dotenv().ok();
    // env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let server = modest_map_maker::run(listener)
        .await
        .expect("failed to start server");
    let _ = tokio::spawn(server);
    format!("http://127.0.0.1:{}", port)
}
