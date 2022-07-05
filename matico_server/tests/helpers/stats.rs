use reqwest;

pub async fn get_stat(
    dataset_id: &str,
    column_name: &str,
    url: &str,
    stat_parameters: &str,
    token: Option<&str>
) -> Result<reqwest::Response, reqwest::Error> {
    let client = reqwest::Client::new();

    let api_url = format!("{url}/{source_type}/{source_id}/columns/{column_name}/stats", 
        source_type = "dataset",
        source_id = dataset_id,
        url=url,
        column_name = column_name);
    
    let mut request = client.get(api_url).query(&[("stat", stat_parameters)]);

    // let stat_params: String = serde_json::to_string(stat_parameters);

    if let Some(token) = token {
        request = request.bearer_auth(token)
    }
    request.send().await
}








// "{source_type}/{source_id}/columns/{column_name}/stats"
