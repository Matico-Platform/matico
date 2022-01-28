use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Dataset {
    GeoJSON(GeoJSONDataset),
    CSV(CSVDataset),
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Clone, Debug)]
pub struct GeoJSONDataset {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub url: String,
}

#[wasm_bindgen]
impl GeoJSONDataset {
    #[wasm_bindgen(getter=name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter=name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name
    }
}

#[wasm_bindgen]
#[derive(Default,Serialize,Deserialize, Clone,Debug)]
struct MaticoRemoteDataset{
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub description: String,

    #[wasm_bindgen(skip)]
    pub server_url: String,
    
    #[wasm_bindgen(skip)]
    pub dataset_id: Option<String>,

    #[wasm_bindgen(skip)]
    pub query_id: Option<String>,

    #[wasm_bindgen(skip)]
    pub query: Option<String>,
}

#[wasm_bindgen]
impl MaticoRemoteDataset{
    #[wasm_bindgen(getter=name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter=name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name
    }

    #[wasm_bindgen(getter=description)]
    pub fn get_description(&self) -> String {
        self.description.clone()
    }

    #[wasm_bindgen(setter=description)]
    pub fn set_description(&mut self, description: String) {
        self.description = description
    }

    #[wasm_bindgen(getter=server_url)]
    pub fn get_server_url(&self) -> String {
        self.server_url.clone()
    }

    #[wasm_bindgen(setter=server_url)]
    pub fn set_server_url(&mut self, server_url: String) {
        self.server_url = server_url
    }

    #[wasm_bindgen(getter=dataset_id)]
    pub fn get_dataset_id(&self) -> Option<String> {
        self.dataset_id.clone()
    }

    #[wasm_bindgen(setter=dataset_id)]
    pub fn set_dataset_id(&mut self, dataset_id: String) {
        self.dataset_id = Some(dataset_id)
    }

    #[wasm_bindgen(getter=query_id)]
    pub fn get_query_id(&self) -> Option<String> {
        self.query_id.clone()
    }

    #[wasm_bindgen(setter=query_id)]
    pub fn set_query_id(&mut self, query_id: String) {
        self.query_id = Some(query_id)
    }

    #[wasm_bindgen(getter=query)]
    pub fn get_query(&self) -> Option<String> {
        self.query.clone()
    }

    #[wasm_bindgen(setter=query)]
    pub fn set_query(&mut self, query: String) {
        self.query = Some(query)
    }
}
#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Clone, Debug)]
pub struct CSVDataset {
    #[wasm_bindgen(skip)]
    pub name: String,

    #[wasm_bindgen(skip)]
    pub url: String,

    #[wasm_bindgen(skip)]
    pub lat_col: Option<String>,

    #[wasm_bindgen(skip)]
    pub lng_col: Option<String>,

    #[wasm_bindgen(skip)]
    pub id_column: Option<String>,
}

#[wasm_bindgen]
impl CSVDataset {
    #[wasm_bindgen(getter=name)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter=name)]
    pub fn set_name(&mut self, name: String) {
        self.name = name
    }
}
