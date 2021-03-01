pub fn csv_format(query: &str) -> String {
    format!("select json_agg(s) as res from ({}) s ", query)
}

pub fn json_format(query: &str) -> String {
    format!("select json_agg(s)::TEXT as res from ({}) s ", query)
}

pub fn geo_json_format(query: &str) -> String {
    format!(
        "select json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(s)::json)::json
    )::TEXT as res  from ({}) s
    ",
        query
    )
}
