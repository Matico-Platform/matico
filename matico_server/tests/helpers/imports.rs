use reqwest;
use std::path::PathBuf;

pub async fn upload_file(
    file_path: &str,
    url: &str,
    metadata: String,
    token: Option<&str>,
) -> Result<reqwest::Response, reqwest::Error> {
    let client = reqwest::Client::new();
    let mut test_file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    test_file_path.push(file_path);

    let reader: Vec<u8> = std::fs::read(test_file_path).expect("Failed to load the file to upload");

    let part = reqwest::multipart::Part::stream(reader).file_name("file.geojson");

    let form = reqwest::multipart::Form::new()
        .text("metadata", metadata)
        .part("file", part);

    let mut request = client.post(url).multipart(form);

    if let Some(token) = token {
        request = request.bearer_auth(token)
    }
    request.send().await
}
