use modest_map_maker::run;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    run().await
}
