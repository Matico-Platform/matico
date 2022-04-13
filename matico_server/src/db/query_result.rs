use std::collections::HashMap;
use geo_types::Geometry;
use serde::{Serialize, Deserialize, Serializer};
use log::info;
use wkb::geom_to_wkb;

use crate::{utils::Format, errors::ServiceError};


#[derive(Serialize)]
pub struct QueryResult{
    pub result: Vec<HashMap<String,Option<QueryVal>>>,
    pub execution_type: u32
}

impl QueryResult{

    pub fn as_format(&self, format: &Format)->Result<String,ServiceError>{
        match format {
            Format::Geojson => self.as_geojson(None),
            Format::Json => self.as_geojson(None),
            Format::Csv => self.as_csv(),
        }
    }

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
            
            let row_vals : Vec<Option<QueryVal>> = row.values().into_iter().map(|val|
                if let Some(QueryVal::Geometry(geom)) = val{
                    Some(QueryVal::Text(base64::encode(geom_to_wkb(geom).unwrap())))
                }
                else{
                    val.to_owned()
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
                       if let Some(QueryVal::Geometry(_)) = val{
                           true 
                        }
                       else{
                           false
                       }
                   });
               key.map(|v| v.0)
            };

            let geom_key = geom_key.ok_or_else(|| ServiceError::InternalServerError("Row had no geometry".into()))?;
    
            let geometry: Geometry<f64> = if let Some(QueryVal::Geometry(geom)) = row.clone().remove(geom_key).unwrap(){
                Ok(geom)
            }
            else{
                Err(ServiceError::InternalServerError("Somehow the selected geom column wasnt a geom or was null".into()))
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


#[derive(Serialize, Deserialize, Clone,Debug)]
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
