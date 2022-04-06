use crate::db::formatters::*;
use crate::db::DataDbPool;
use crate::db::DataSource;
use crate::errors::ServiceError;
use crate::models::Api;
use crate::models::Column as DatasetColumn;
use crate::models::Dataset;
use crate::models::User;
use crate::utils::{Format, PaginationParams, QueryMetadata, SortParams};
use async_trait::async_trait;
use cached::proc_macro::cached;
use log::info;
use log::warn;
use serde::Serializer;
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::{Column, Row,TypeInfo};
use sqlx::postgres::PgTypeInfo;
use std::collections::HashMap;
use std::convert::From;
use geo_types::Geometry;
use geozero::wkb;
use ::wkb::geom_to_wkb;


#[derive(Serialize, Deserialize)]
pub struct BBox {
    x_min: f32,
    x_max: f32,
    y_min: f32,
    y_max: f32,
}

#[derive(Serialize, Deserialize)]
pub struct Bounds {
    bounds: Option<BBox>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TilerOptions {
    geom_column: Option<String>,
    tollerance: Option<u64>,
    crs: Option<String>,
}

pub struct Filter{}

#[derive(Deserialize, Debug)]
pub struct TileID {
    x: f64,
    y: f64,
    z: f64,
}


#[derive(Default)]
pub struct PostgisQueryBuilder{
    dataset: Option<Dataset>,
    api: Option<Api>,
    api_params: Option<HashMap<String, serde_json::Value>>,
    query: Option<String>,
    filters: Option<Vec<Filter>>,
    user: Option<User>,
    bounds: Option<Bounds>,
    page: Option<PaginationParams>,
    sort: Option<SortParams>,
    tile: Option<TileID>,
}

impl PostgisQueryBuilder{

    pub fn new()->Self{
        Default::default()
    }
    
    pub fn dataset(&mut self, dataset:Dataset)->&mut Self{
        self.dataset = Some(dataset);
        self
    }

    pub fn api(&mut self, api:Api, params: HashMap<String, serde_json::Value>)->&mut Self{
        self.api = Some(api);
        self.api_params= Some(params);
        self
    }

    pub fn query(&mut self, query:String)->&mut Self{
        self.query = Some(query);
        self
    }

    pub fn filters(&mut self,filters:Vec<Filter>)->&mut Self{
        self.filters = Some(filters);
        self
    }

    pub fn user(&mut self, user:User)->&mut Self{
        self.user = Some(user);
        self
    }

    pub fn bounds(&mut self, bounds: Bounds)->&mut Self{
        self.bounds =Some(bounds);
        self
    }

    pub fn page(&mut self, page:PaginationParams) ->&mut Self{
        self.page = Some(page);
        self
    }

    pub fn sort(&mut self, sort:SortParams)->&mut Self{
        self.sort = Some(sort);
        self
    }

    pub fn tile(&mut self, tile:TileID)->&mut Self{
        self.tile = Some(tile);
        self
    }

    fn base_query(&self)->Result<String,ServiceError>{
        match (&self.query, &self.dataset, &self.api, &self.api_params){
            (Some(query), None,None,None)=>  Ok(query.clone()),
            (None, Some(dataset), None,None)=> Ok(format!("select * from {}", dataset.table_name)),
            (None , None, Some(api),Some(params)) => api.construct_query(&params),
            (None , None, Some(api),None) => Err(ServiceError::InternalServerError("An API was set without specifying parameters".into())),
            (None, None, None, None) => Err(ServiceError::InternalServerError("Query builder requires at least one of Dataset, API or quert ".into())),
            _ => Err(ServiceError::InternalServerError("Mutilple sources set for query builder".into()))
        }
    }

    fn build_query(&self)->Result<String, ServiceError>{
        let mut base_query = self.base_query()?; 

        // let base_query = if let Some(filters)= self.filters{
        //     format!("{} WHERE {}",base_query,filters)
        // };

        // let base_query = if let Some(bounds)= self.bounds{
        //     format!("{} {}",base_query,bounds)
        // };

        if let Some(sort) = &self.sort{
            base_query = format!("{} {}", base_query, sort)
        }

        if let Some(page) = &self.page{
            base_query = format!("{} {}", base_query, page)
        };

        Ok(base_query)
    }
    
    async fn columns(&self, db:&DataDbPool)->Result< Vec<DatasetColumn> , ServiceError>{
        let query = self.build_query()?;
        local_get_query_column_details(&db, &query).await
    }

    pub async fn get_tile(&self, db: &DataDbPool,
        tiler_options: TilerOptions,
        tile_id: TileID
        )->Result<MVTTile,ServiceError>{
        let query = self.build_query()?;
        cached_tile_query(db, &query, tiler_options, tile_id).await 
    }

    pub async fn get_result(&self, db: &DataDbPool)-> Result<QueryResult, ServiceError>{
        let query = self.build_query()?;
        
        let result = sqlx::query(&query)
            .map(|row: PgRow| {
                let mut hash : HashMap<String, QueryVal> = HashMap::new();
                for col in row.columns(){
                    let type_info : &PgTypeInfo = col.type_info();
                    // info!("Column type is {:#?} {:#?}", type_info, type_info.name() );
                    let val: QueryVal = match type_info.name(){
                       "INT8" | "INT2" | "INT4"   => { 
                           let val: i32 = row.get(col.name());
                            QueryVal::Int(val)
                       }, 
                       "FLOAT4" | "FLOAT8"  =>{
                            let val: f64 = row.get(col.name());
                            QueryVal::Float(val)
                       },
                       "NUMERIC"=>{
                            let val : sqlx::types::BigDecimal = row.get(col.name());
                            QueryVal::Numeric(val)
                       },
                       "TEXT" | "VARCHAR" =>{
                            let val :String = row.get(col.name());
                            QueryVal::Text(val)
                       },
                       "geometry"=>{
                           let val: wkb::Decode<geo_types::Geometry<f64>> = row.get(col.name());
                           QueryVal::Geometry(val.geometry.unwrap())
                       }
                       "BOOL"=>{
                            let val : bool = row.get(col.name());
                            QueryVal::Bool(val)
                       }
                       , 
                        _=>{
                            warn!("Unsuported postgis type {:#?}", type_info);
                            QueryVal::Unsupported
                        } 
                    };
                    hash.insert(col.name().to_string(), val);
                };
                hash
            })
            .fetch_all(db)
            .await
            .map_err(|e| ServiceError::QueryFailed(format!("Query Failed : {}", e)))?;

        Ok(QueryResult{result, execution_type:0})
    }
}

#[derive(Serialize)]
pub struct QueryResult{
    pub result: Vec<HashMap<String,QueryVal>>,
    pub execution_type: u32
}

impl QueryResult{

/// Return the Result as a CSV string 
/// This can probably be refactored to work as a stream
/// also to use geozero more for the conversions
    pub fn as_csv(&self)->Result<String, ServiceError>{
        let mut wtr = csv::Writer::from_writer(vec![]);
        let mut header_written = false;
        let mut header_length = 0;
        for row in self.result.iter(){

            if !header_written{
                let header: Vec<&String> = row.keys().into_iter().collect();
                header_length=header.len();
                info!("Header length is {}", header_length);
                wtr.serialize(header).unwrap();
                header_written=true;
            }
            
            let row_vals : Vec<QueryVal> = row.values().into_iter().map(|val|
                if let QueryVal::Geometry(geom) = val{
                    QueryVal::Text(base64::encode(geom_to_wkb(geom).unwrap()))
                }
                else{
                    val.clone()
                }
            ).collect();

            wtr.serialize(row_vals)
                .map_err(|e| ServiceError::InternalServerError(format!("Result to csv failed {}",e)))?;

        }
        let data = String::from_utf8(wtr.into_inner().unwrap()).unwrap();
        Ok(data)

    }

    pub fn as_geojson(&self, geom_col : Option<&String>)->Result<String,ServiceError>{
        let mut features : Vec<geojson::Feature> = vec![];
        for mut row in self.result.iter().cloned(){
            let geom_key = if geom_col.is_some(){
                geom_col
            }
            else{
               let key =  row.iter().find(
                   |(_key,val)| {
                       if let QueryVal::Geometry(_) = val{
                           true 
                        }
                       else{
                           false
                       }
                   });
               key.map(|v| v.0)
            };

            let geom_key = geom_key.ok_or_else(|| ServiceError::InternalServerError("Row had no geometry".into()))?;
    
            let geometry: Geometry<f64> = if let QueryVal::Geometry(geom) = row.clone().remove(geom_key).unwrap(){
                Ok(geom)
            }
            else{
                Err(ServiceError::InternalServerError("Somehow the selected geom column wasnt a geom".into()))
            }?;

            let properties: serde_json::map::Map<String,serde_json::value::Value> = row.drain().map(|(key,val)| (key,serde_json::to_value(val).unwrap())).collect();
             
            let feature = geojson::Feature{
                bbox:None,
                geometry: Some(geojson::Geometry::from(&geometry)),
                id:None,
                foreign_members:None,
                properties: Some(properties) 
            };
            features.push(feature);
        };
        let feature_collection = geojson::FeatureCollection{
            bbox:None,
            features,
            foreign_members:None 
        };
        Ok(feature_collection.to_string())
    }

}


#[derive(Serialize, Clone,Debug)]
#[serde(untagged)]
pub enum QueryVal{
    Text(String),
    Int(i32),
    Float(f64),
    Numeric(sqlx::types::BigDecimal),
    Bool(bool),
    #[serde(serialize_with = "serialize_geom")]
    Geometry(geo_types::Geometry<f64>),
    Unsupported
}


/// This simply passes the serializer to each variant of the geometry type 
/// Not sure why this isn't implemented in the library
fn serialize_geom <S> (geom:&geo_types::Geometry<f64>, s:S) -> Result<S::Ok, S::Error>
where S:Serializer
{
    match geom{
        Geometry::Point(geom)=> geom.serialize(s) ,
        Geometry::Line(geom) => geom.serialize(s)   ,
        Geometry::LineString(geom)=>  geom.serialize(s),
        Geometry::Polygon(geom)=>geom.serialize(s),
        Geometry::MultiPoint(geom)=>geom.serialize(s),
        Geometry::MultiLineString(geom)=>geom.serialize(s),
        Geometry::MultiPolygon(geom)=>geom.serialize(s),
        Geometry::GeometryCollection(_)=>s.serialize_str("GeomCollection"),
        Geometry::Rect(geom)=>geom.serialize(s),
        Geometry::Triangle(geom)=>geom.serialize(s),
    } 
}


#[derive(PartialEq, Debug, Clone)]
pub struct MVTTile {
    pub mvt: Vec<u8>,
}

async fn local_get_query_column_details(
    pool: &DataDbPool,
    query: &str,
) -> Result<Vec<DatasetColumn>, ServiceError> {
    let columns = sqlx::query(query)
        .map(|row: PgRow| {
            let cols = row.columns();
            let columns: Vec<DatasetColumn> = cols
                .iter()
                .map(|col| DatasetColumn {
                    name: col.name().to_string(),
                    col_type: col.type_info().name().into(),
                    source_query: query.into(),
                })
                .collect();
            columns
        })
        .fetch_one(pool)
        .await
        .map_err(|e| {
            warn!("SQL Query failed: {} {}", e, query);
            ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, query))
        })?;

    Ok(columns)
}

#[cached(
    size = 1,
    time = 86400,
    result = true,
    convert = r#"{format!("{}_{:?}_{:?}",query,tiler_options,tile_id) }"#,
    key = "String"
)]
pub async fn cached_tile_query(
    pool: &DataDbPool,
    query: &str,
    tiler_options: TilerOptions,
    tile_id: TileID,
) -> Result<MVTTile, ServiceError> {
    // TODO This is an annoying and potentially non preformat
    // way of getting the columns names we want to include.
    // One solution will be to require the passing of the
    // required columns in the query. Another might be to see
    // if we can easily cache this call in the server. Better would
    // be if postgresql had an exclude keyword or if we can find some
    // other way to do this in the db
    let columns = local_get_query_column_details(pool, query).await?;

    let column_names: Vec<String> = columns
        .iter()
        .filter(|col| col.col_type != "geometry")
        .map(|col| format!("\"{}\"", col.name))
        .collect();
    let select_string = column_names.join(",");

    let geom_column = match tiler_options.geom_column {
        Some(column) => column,
        None => String::from("wkb_geometry"),
    };

    let formatted_query = format!(
        include_str!("tile_query.sql"),
        columns = select_string,
        geom_column = geom_column,
        tile_table = query,
        x = tile_id.x,
        y = tile_id.y,
        z = tile_id.z,
    );

    let result: Vec<u8> = sqlx::query(&formatted_query)
        .map(|row: PgRow| row.get("mvt"))
        .fetch_one(pool)
        .await
        .map_err(|e| {
            warn!("SQL Query failed: {} {}", e, formatted_query);
            ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
        })?;

    Ok(MVTTile { mvt: result })
}

pub struct PostgisDataSource;

impl PostgisDataSource {
    pub async fn get_query_column_details(
        pool: &DataDbPool,
        query: &str,
    ) -> Result<Vec<DatasetColumn>, ServiceError> {
        local_get_query_column_details(pool, query).await
    }

    pub fn user_scope_statement(user: &Option<User>)->String{
        //# Turning this off for now
        return "".into();
        if let Some(user) = user{
            format!("SET ROLE {};", user.username) 
        }
        else{
            String::from("USE ROLE global_public;")
        }
    } 

     pub fn paginate_query(query: &str, page: Option<PaginationParams>) -> String {
        let page_str = match page {
            Some(page) => page.to_string(),
            None => String::from(""),
        };
        format!(
            "select * from ({sub_query}) as a {page}",
            sub_query = query,
            page = page_str
        )
    }
    
    pub fn ordered_query(query: &str, sort: Option<SortParams>) -> String {
        let sort_str = match sort{
            Some(sort_options) => sort_options.to_string(),
            None => String::from(""),
        };
        format!(
            "select * from ({sub_query}) as ordered {order}",
            sub_query = query,
            order = sort_str 
        )
    }

    pub async fn create_public_user(pool: &DataDbPool)->Result<(),ServiceError>{
       let user_exists  =sqlx::query("SELECT 1 FROM pg_user WHERE usename= 'global_public'")
           .fetch_one(pool)
           .await
           .is_ok();
    
       if !user_exists{
           sqlx::query("CREATE USER global_public")
                .execute(pool)
               .await
               .map_err(|_| ServiceError::InternalServerError("Failed to create public user".into()))?;
       }
       Ok(())
    }

    pub async fn setup(
        pool: &DataDbPool,
    ) ->Result<(),ServiceError>{
        Self::create_public_user(&pool).await?; 
        Ok(())
    }
}

#[async_trait]
impl DataSource for PostgisDataSource {
    async fn run_metadata_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
    ) -> Result<QueryMetadata, ServiceError> {

        let scope_statement = Self::user_scope_statement(user);
        
        let result = sqlx::query(&format!("{} SElECT count(*) as total from ({}) a ", scope_statement, query))
            .map(|row: PgRow| QueryMetadata {
                total: row.get("total"),
            })
            .fetch_one(pool)
            .await
            .map_err(|e| {
                warn!("Failed to get metadata for query, {}", e);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was  {}", e, query))
            })?;

        Ok(result)
    }

    async fn run_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
        page: Option<PaginationParams>,
        sort: Option<SortParams>,
        format: Format,
    ) -> Result<serde_json::Value, ServiceError> {
        let ordered_query = Self::ordered_query(query, sort);
        let paged_query = Self::paginate_query(&ordered_query, page);
        let scope_statement = Self::user_scope_statement(user);

        let formatted_query = match format {
            Format::Csv => Ok(csv_format(&paged_query)),
            Format::Geojson => Ok(geo_json_format(&paged_query)),
            Format::Json => Ok(json_format(&paged_query)),
        }?;

        let formatted_query = format!("{} {}", scope_statement, formatted_query);

        println!("running query {}", formatted_query);

        let result: String = sqlx::query(&formatted_query)
            .map(|row: PgRow| row.get("res"))
            .fetch_one(pool)
            .await
            .map_err(|e| {
                warn!("SQL Query failed: {} {}", e, formatted_query);
                ServiceError::QueryFailed(format!("SQL Error: {} Query was {}", e, formatted_query))
            })?;

        let json: serde_json::Value = serde_json::from_str(&result)
            .map_err(|_| ServiceError::InternalServerError("failed to parse json".into()))?;
        Ok(json)
    }

    async fn setup_user(pool: &DataDbPool, user: &User) -> Result<(), ServiceError> {
        sqlx::query("CREATE USER $1 ")
            .bind(user.username.clone())
            .execute(pool)
            .await
            .map_err(|e| {
                warn!("Failed to create user in database {:#?}", e);
                ServiceError::InternalServerError("Failed to create user on database".into())
            })?;

        Ok(())
    }

    async fn run_tile_query(
        pool: &DataDbPool,
        query: &str,
        user: &Option<User>,
        tiler_options: TilerOptions,
        tile_id: TileID,
    ) -> Result<MVTTile, ServiceError> {
        cached_tile_query(pool, query, tiler_options, tile_id).await
    }
}
