use geo::{polygon,line_string,point}; 
use wasm_bindgen::prelude::*;
use arrow2::io::ipc::read;
use std::io::{Cursor};

#[wasm_bindgen]
pub fn buffer(table: &[u8])->String{
   let mut reader = Cursor::new(table);

   let metadata = read::read_stream_metadata(&mut reader); 

   format!("metadata {:#?}",metadata)
}
