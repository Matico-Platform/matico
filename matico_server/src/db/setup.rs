use crate::db::DbPool;

embed_migrations!();

pub fn run_migrations(pool: &DbPool) {
    let conn = pool.get().unwrap();
    embedded_migrations::run_with_output(&conn, &mut std::io::stdout()).expect("FAILED TO RUN MIGRATIONS!");
}
