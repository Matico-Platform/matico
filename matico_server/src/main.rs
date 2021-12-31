use matico_server::app_config::Config;
use matico_server::run;
use std::net::TcpListener;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use dotenv;
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let config = Config::from_conf().unwrap();
    let listener = TcpListener::bind(&config.server_addr).expect("Failed to bind to address");
    println!("Server runnning at {}", &config.server_addr);
    run(listener, config).await?.await
}
