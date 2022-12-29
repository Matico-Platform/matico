use matico_dataservice::dataservice::{
    DataService, DatasetSpecification, InlineSpecifiction, InputDatasetFormat, RemoteSpecification,
    RequestFetcher,
};
use matico_spec::{DatasetTransform, DatasetTransformStep, Filter, FilterStep, RangeFilter, VarOr};

use std::fs::File;
use std::io::BufReader;

mod helpers;
use helpers::*;

#[tokio::test]
async fn should_be_able_to_load_datasets_from_urls() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Remote(RemoteSpecification {
            url: "https://raw.githubusercontent.com/Matico-Platform/sample-data/main/earthquakes/earthquakes.csv".into(),
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let csv2_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Remote(RemoteSpecification {
            url: "https://raw.githubusercontent.com/Matico-Platform/sample-data/main/earthquakes/earthquakes.csv".into(),
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV2 dataset");

    let csv_dataset = dataset_service.get_dataset(&csv_dataset_id);

    let sql_result = dataset_service
        .run_sql(
            &csv_dataset_id,
            "select time, title, time*10 as time2 from dataset",
        )
        .unwrap();

    // let json_dataset_id = dataset_service
    //     .register_dataset(DatasetSpecification::Remote(RemoteSpecification {
    //         url: "https://raw.githubusercontent.com/Matico-Platform/sample-data/main/30-day-map-challenge/1-points/post_offices.feather".into(),
    //         format: InputDatasetFormat::Arrow,
    //     }))
    //     .await
    //     .expect("Failed to load ARROW dataset");
    //
    // println!("result is {:#?}", csv_dataset);

    let status = dataset_service.get_status();
    println!("status is {:#?}", status);
    println!("dataset is {:#?}", csv_dataset);
    println!("sql result is {:#?}", sql_result);
}

#[tokio::test]
async fn should_be_able_to_load_datasets_localy() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();
    let data = load_dataset("us-counties-2021.txt").expect("Failed to load dataset");

    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let dataset = dataset_service
        .get_dataset(&csv_dataset_id)
        .expect("faild to find registered dataset");

    println!("Dataset {:#?}", dataset.data);
}

#[tokio::test]
async fn should_be_able_to_run_transform() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let data = load_dataset("us-counties-2021.txt").expect("Failed to load dataset");

    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let steps = vec![DatasetTransformStep::Filter(FilterStep {
        filters: vec![Filter::Range(RangeFilter {
            variable: "deaths".into(),
            min: Some(VarOr::Value(0.0)),
            max: Some(VarOr::Value(100.0)),
        })],
    })];

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);
    println!("Result {:#?}", result);
    assert!(result.is_ok());
}
