use actix_multipart::Multipart;
use actix_web::{get, post, web, Error, HttpResponse};
use futures::{StreamExt, TryStreamExt};
use gdal::errors::GdalError;
use gdal::spatial_ref::{CoordTransform, SpatialRef};
use gdal::vector::OGRFieldType;
use gdal::vector::OGRwkbGeometryType;
use gdal::vector::*;
use gdal::Metadata;
use gdal::{Dataset, Driver};
use std::io::Write;
use std::path::Path;



pub fn injest_file_to_pg(filepath: &str) -> Result<(), GdalError> {
    let mut dataset = Dataset::open(Path::new(filepath))?;

    let mut postgis = Dataset::open(Path::new("PG: host=localhost dbname=stuart user=stuart"))?;
    let srs = SpatialRef::from_epsg(4321)?;

    let mut ds = postgis.create_layer(&"test", Some(&srs), OGRwkbGeometryType::wkbMultiPolygon)?;
    //    let mut pg_driver = Driver::get("PostgreSQL")?;
    println!("have dataset and driver");
    // //    pg_driver.set_metadata_item("DBNAME", "stuart","PG" )?;
    //    pg_driver.set_metadata_item("USER", "stuart","PG" )?;
    //    let mut ds = pg_driver.create_vector_only("world")?;

    for (i, layer) in dataset.layers().enumerate() {
        println!("Uploading layer {}", i);
        let feild_defn = layer
            .defn()
            .fields()
            .map(|field| (field.name(), field.field_type(), field.width()))
            .collect::<Vec<_>>();
    }
    Ok(())
}
