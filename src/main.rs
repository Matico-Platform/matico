use modest_map_maker::run;
use std::net::TcpListener;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8000").expect("Failed to bind to address");
    println!("Server runnning at 127.0.0.1:8000");
    run(listener).await?.await
}
