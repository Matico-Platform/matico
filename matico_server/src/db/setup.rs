use crate::db::DbPool;

embed_migrations!();

pub fn run_migrations(pool: &DbPool) {
    let conn = pool.get().unwrap();
    //Figure out how to send this to log crate using run_with_output
    embedded_migrations::run(&conn).expect("FAILED TO RUN MIGRATIONS!");
}
