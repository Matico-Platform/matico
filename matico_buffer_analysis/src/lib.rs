use arrow2::io::ipc::read;
use geo::{line_string, point, polygon};
use std::io::Cursor;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn buffer(table: &[u8]) -> String {
    let mut reader = Cursor::new(table);

    let metadata = read::read_stream_metadata(&mut reader);

    format!("metadata {:#?}", metadata)
}
