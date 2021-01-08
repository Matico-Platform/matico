use actix_web::{get,post,HttpResponse,Error, web};
use std::io::Write;
use actix_multipart::Multipart;
use futures::{StreamExt,TryStreamExt};
use gdal::spatial_ref::{CoordTransform,SpatialRef};
use gdal::{Dataset,Driver};
use gdal::vector::*;
use gdal::errors::GdalError;
use std::path::Path;
use gdal::vector::OGRFieldType;
use gdal::vector::OGRwkbGeometryType;
use gdal::Metadata;

fn guess_geo_format(content_type:&str, filename: &str){

}

#[get("/")]
pub async fn simple_upload_form()->HttpResponse{
    let html = r#"<html>
        <head><title>Upload test</title></head>
        <body>
            <form target="/" method="post" enctype="multipart/form-data">
            <input type="file" multiple name="file">
            <button type="submit">Submit</button>
        </body>
    </html>"#;
    HttpResponse::Ok().body(html)
}

fn get_file_info(filepath: &str)->Result<Vec<(String,u32,i32)>,GdalError>{
    let mut dataset = Dataset::open(Path::new(filepath))?;
    let layer = dataset.layer(0)?;
    let fields = layer.defn().fields().map(|field| (field.name(), field.field_type(),field.width())).collect::<Vec<_>>();
    Ok(fields)
}

pub fn injest_file_to_pg(filepath: &str)-> Result<(),GdalError>{
   let mut dataset = Dataset::open(Path::new(filepath))?; 

   let mut postgis = Dataset::open(Path::new("PG: host=localhost dbname=stuart user=stuart"))?;
   let srs = SpatialRef::from_epsg(4321)?;

   let mut ds = postgis.create_layer(&"test",Some(&srs),OGRwkbGeometryType::wkbMultiPolygon)?;
//    let mut pg_driver = Driver::get("PostgreSQL")?;
   println!("have dataset and driver");
// //    pg_driver.set_metadata_item("DBNAME", "stuart","PG" )?;
//    pg_driver.set_metadata_item("USER", "stuart","PG" )?;
//    let mut ds = pg_driver.create_vector_only("world")?;


   for (i,layer) in dataset.layers().enumerate(){
    println!("Uploading layer {}",i);
    let feild_defn = layer.defn().fields().map(|field| (field.name(), field.field_type(), field.width())).collect::<Vec<_>>();
   }
   Ok(())
}

#[post("/")]
pub async fn upload_geo_file(mut payload: Multipart)-> Result<HttpResponse,Error>{
    while let Ok(Some(mut field)) = payload.try_next().await{
        let content_type = field.content_disposition().unwrap();
        let filename = content_type.get_filename().unwrap();
        println!("filename {} content_type {}",filename, content_type);

        let filepath= format!("./tmp/{}", sanitize_filename::sanitize(&filename));

        let mut f = web::block(move ||{
            std::fs::create_dir_all("./tmp").expect("was unable to create dir");
            std::fs::File::create(&filepath.clone())
        })
        .await
        .unwrap();

        while let Some(chunk) = field.next().await{
            let data = chunk.unwrap();
            f = web::block(move || f.write_all(&data).map(|_| f)).await?;
        }

        let filepath= format!("./tmp/{}", sanitize_filename::sanitize(&filename));

        let fileinfo = web::block(move ||{
            get_file_info(&filepath.clone())
        }).await?;
        println!("file info is {:?}", fileinfo);

        let filepath= format!("./tmp/{}", sanitize_filename::sanitize(&filename));


        println!("Attempting to load to DB");
        web::block(move||{
            injest_file_to_pg(&filepath)
        }).await?;

        let filepath= format!("./tmp/{}", sanitize_filename::sanitize(&filename));
        web::block(move||{
            std::fs::remove_file(filepath)
        }).await?
    }
    Ok(HttpResponse::Ok().body("Uploaded"))
}


pub fn init_routes(cfg: &mut web::ServiceConfig){
    cfg.service(simple_upload_form);
    cfg.service(upload_geo_file);
}