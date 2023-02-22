use matico_dataservice::dataservice::{
    DataService, DatasetSpecification, InlineSpecifiction, InputDatasetFormat, RemoteSpecification,
    RequestFetcher,
};
use matico_spec::{
    AggregateStep, AggregationSummary, AggregationType, CategoryFilter, DatasetTransform,
    DatasetTransformStep, Filter, FilterStep, JoinStep, JoinType, RangeFilter, SQLStep, VarOr,
};

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
    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");

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

    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");

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
            min: Some(0.0.into()),
            max: Some(100.0.into()),
        })],
    })];

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);
    println!("Result {:#?}", result);
    assert!(result.is_ok());
}

#[tokio::test]
async fn should_be_able_to_perform_aggregates() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");
    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let steps = vec![DatasetTransformStep::Aggregate(AggregateStep {
        group_by_columns: vec!["state".into()],
        aggregate: vec![
            AggregationSummary {
                column: "deaths".into(),
                agg_type: AggregationType::Sum,
                rename: Some("death_total".into()),
            },
            AggregationSummary {
                column: "deaths".into(),
                agg_type: AggregationType::Median,
                rename: Some("death_median".into()),
            },
            AggregationSummary {
                column: "cases".into(),
                agg_type: AggregationType::Median,
                rename: Some("cases_median".into()),
            },
        ],
    })];

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);

    println!("Result {:#?}", result);
    assert!(result.is_ok());
}

#[tokio::test]
async fn should_be_able_to_perform_multi_step_transfrom() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");
    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let steps = vec![
        DatasetTransformStep::Filter(FilterStep {
            filters: vec![Filter::Range(RangeFilter {
                max: Some(100.0.into()),
                min: None,
                variable: "deaths".into(),
            })],
        }),
        DatasetTransformStep::Aggregate(AggregateStep {
            group_by_columns: vec!["state".into()],
            aggregate: vec![
                AggregationSummary {
                    column: "deaths".into(),
                    agg_type: AggregationType::Sum,
                    rename: Some("death_total".into()),
                },
                AggregationSummary {
                    column: "deaths".into(),
                    agg_type: AggregationType::Median,
                    rename: Some("death_median".into()),
                },
                AggregationSummary {
                    column: "cases".into(),
                    agg_type: AggregationType::Median,
                    rename: Some("cases_median".into()),
                },
            ],
        }),
        DatasetTransformStep::Filter(FilterStep {
            filters: vec![Filter::Range(RangeFilter {
                min: Some(20.0.into()),
                max: None,
                variable: "cases_median".into(),
            })],
        }),
    ];

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);
    assert!(result.is_ok());
    println!("Result is {:#?}", result);
}

#[tokio::test]
async fn should_be_able_to_perform_joins() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");

    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let other_dataset: Vec<u8> = r"state,motto
        New York, Fuck Yeay
        Conneticut, Where am I?
        Wyoming, Wyomorning"
        .as_bytes()
        .to_vec();

    let moto_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data: other_dataset,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let moto_dataset = dataset_service.get_dataset(&moto_dataset_id).unwrap();
    println!("moto dataset {:#?} ", moto_dataset.data);

    let steps = vec![DatasetTransformStep::Join(JoinStep {
        other_source_id: moto_dataset_id.to_string(),
        join_type: JoinType::Inner,
        join_columns_left: vec!["state".into()],
        join_columns_right: vec!["state".into()],
        left_prefix: "left".into(),
        right_prefix: "right".into(),
    })];

    let plan = dataset_service
        .generate_plan_for_transform(&csv_dataset_id, &steps)
        .unwrap();

    println!("Lazy frame is {:#?}", plan.logical_plan);

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);
    assert!(result.is_ok());
    println!("Result is {:#?}", result);
}

#[tokio::test]
async fn should_be_able_to_perform_sql_as_part_of_chain() {
    let mut dataset_service: DataService<RequestFetcher> = DataService::new();

    let data = load_resource("us-counties-2021.txt").expect("Failed to load dataset");

    let csv_dataset_id = dataset_service
        .register_dataset(DatasetSpecification::Inline(InlineSpecifiction {
            data,
            format: InputDatasetFormat::CSV,
        }))
        .await
        .expect("Failed to load CSV dataset");

    let steps = vec![
        DatasetTransformStep::Filter(FilterStep {
            filters: vec![Filter::Category(CategoryFilter {
                variable: "state".into(),
                is_one_of: Some(vec!["Alabama".into()]),
                is_not_one_of: None,
            })],
        }),
        DatasetTransformStep::Sql(SQLStep {
            input_table_name: None,
            sql: String::from("Select *, cases*100 as log_cases from dataset"),
        }),
        DatasetTransformStep::Filter(FilterStep {
            filters: vec![Filter::Range(RangeFilter {
                variable: "log_cases".into(),
                min: Some(1000.0.into()),
                max: None,
            })],
        }),
    ];

    let plan = dataset_service
        .generate_plan_for_transform(&csv_dataset_id, &steps)
        .unwrap();

    println!("Lazy frame is {:#?}", plan.logical_plan);

    let result = dataset_service.run_transform(&csv_dataset_id, &steps);
    println!("Result is {:#?}", result);
    assert!(result.is_ok());
    println!("Result is {:#?}", result);
}

#[tokio::test]
async fn should_be_able_to_load_and_run_wasm_module() {
    let wasm = load_resource("wasm_module.wasm").expect("Failed to load wasm module");
    println!("Got resource");

    let mut dataset_service: DataService<RequestFetcher> = DataService::new();
    println!("created dataset service");
    dataset_service
        .register_plugin("wasm", &wasm)
        .expect("Should have been able to load wasm");
}
