use std::{
    fs::File,
    io::{BufReader, Read},
    path::PathBuf,
};

pub fn load_resource(file_path: &str) -> Result<Vec<u8>, String> {
    let mut test_file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    test_file_path.push(format!("test_data/{}", file_path));

    let file = File::open(test_file_path).expect("Failed to find example datafile");
    let mut buffer = BufReader::new(&file);

    let mut data: Vec<u8> = vec![];
    match buffer.read_to_end(&mut data) {
        Ok(_) => Ok(data),
        Err(e) => Err(format!("Failed to read file {} : {}", file_path, e)),
    }
}
