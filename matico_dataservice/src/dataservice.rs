use crate::plugin::Plugin;
use anyhow::Context;
use async_trait::async_trait;
use matico_spec::AggregateStep;
use matico_spec::DatasetTransform;
use matico_spec::DatasetTransformStep;
use matico_spec::FilterStep;
use matico_spec::JoinStep;
use matico_spec::SQLStep;
use polars::prelude::*;
use polars::sql::SQLContext;
use std::{collections::HashMap, io::Cursor, marker::PhantomData};
use uuid::Uuid;
use wasmer::Module;

#[derive(Debug)]
pub enum DataSourceStatus {
    Ready,
    Loading,
    Pending,
    Error(String),
}

#[derive(Debug, Clone)]
pub enum InputDatasetFormat {
    Arrow,
    Parquet,
    CSV,
    JSON,
    GeoJSON,
    ShapeFile,
}

#[derive(Debug, Clone)]
pub struct RemoteSpecification {
    pub url: String,
    pub format: InputDatasetFormat,
}

#[derive(Debug, Clone)]
pub struct InlineSpecifiction {
    pub data: Vec<u8>,
    pub format: InputDatasetFormat,
}

#[derive(Debug, Clone)]
pub enum DatasetSpecification {
    Remote(RemoteSpecification),
    Inline(InlineSpecifiction),
}

impl Default for DataSourceStatus {
    fn default() -> Self {
        DataSourceStatus::Pending
    }
}

#[derive(Debug)]
pub struct Dataset {
    pub specification: DatasetSpecification,
    pub status: DataSourceStatus,
    pub data: Option<DataFrame>,
}

impl From<Dataset> for LazyFrame {
    fn from(d: Dataset) -> Self {
        d.data.clone().unwrap().lazy()
    }
}

impl From<&Dataset> for LazyFrame {
    fn from(d: &Dataset) -> Self {
        d.data.clone().unwrap().lazy()
    }
}

impl From<DatasetSpecification> for Dataset {
    fn from(spec: DatasetSpecification) -> Self {
        Self {
            specification: spec,
            status: DataSourceStatus::Pending,
            data: None,
        }
    }
}

pub struct Transform {
    status: DataSourceStatus,
    specification: DatasetTransform,
}

#[async_trait]
pub trait DataFetcher {
    async fn fetch(url: &str) -> std::result::Result<Vec<u8>, String>;
}

pub struct DataService<Fetcher>
where
    Fetcher: DataFetcher,
{
    datasets: HashMap<Uuid, Dataset>,
    wasm_modules: HashMap<String, Module>,
    transforms: HashMap<Uuid, Transform>,
    fetcher_type: PhantomData<Fetcher>,
    plugin_instances: HashMap<Uuid, Plugin>,
}

fn data_to_frame(
    data: &[u8],
    format: &InputDatasetFormat,
) -> std::result::Result<DataFrame, String> {
    let cursor = Cursor::new(data);
    match format {
        InputDatasetFormat::Arrow => IpcReader::new(cursor)
            .finish()
            .map_err(|e| format!("Failed to parse Arrow {}", e)),
        InputDatasetFormat::Parquet => todo!(),
        InputDatasetFormat::CSV => CsvReader::new(cursor)
            .finish()
            .map_err(|e| format!("Failed to parse CSV {}", e)),
        InputDatasetFormat::JSON => JsonReader::new(cursor)
            .finish()
            .map_err(|e| format!("Failed to parse JSON {}", e)),
        InputDatasetFormat::GeoJSON => todo!(),
        InputDatasetFormat::ShapeFile => todo!(),
    }
}

fn apply_aggregate_step(df: LazyFrame, details: &AggregateStep) -> LazyFrame {
    let group_by_cols: Vec<Expr> = details.group_by_columns.iter().map(|e| col(e)).collect();
    let aggregates: Vec<Expr> = details
        .aggregate
        .iter()
        .map(|agg| match agg.agg_type {
            matico_spec::AggregationType::Min => col(&agg.column)
                .min()
                .alias(&agg.rename.clone().unwrap_or(format!("{}_min", agg.column))),
            matico_spec::AggregationType::Max => col(&agg.column)
                .max()
                .alias(&agg.rename.clone().unwrap_or(format!("{}_max", agg.column))),
            matico_spec::AggregationType::Sum => col(&agg.column)
                .sum()
                .alias(&agg.rename.clone().unwrap_or(format!("{}_sum", agg.column))),
            matico_spec::AggregationType::CumulativeSum => col(&agg.column)
                .cum_sum(true)
                .alias(&agg.rename.clone().unwrap_or(format!("{}_sum", agg.column))),
            matico_spec::AggregationType::Mean => col(&agg.column)
                .mean()
                .alias(&agg.rename.clone().unwrap_or(format!("{}_mean", agg.column))),
            matico_spec::AggregationType::Median => col(&agg.column).median().alias(
                &agg.rename
                    .clone()
                    .unwrap_or(format!("{}_median", agg.column)),
            ),
            matico_spec::AggregationType::StandardDeviation => col(&agg.column)
                .std(0)
                .alias(&agg.rename.clone().unwrap_or(format!("{}_std", agg.column))),
        })
        .collect();

    println!("perfroming aggregate step");
    df.group_by(group_by_cols).agg(aggregates)
}

fn apply_filter_step(df: LazyFrame, filter_step: &FilterStep) -> Result<LazyFrame, String> {
    filter_step.filters.iter().try_fold(df, move |result, f| {
        match f {
            matico_spec::Filter::NoFilter => Ok(result),
            matico_spec::Filter::Range(range_filter) => {
                let next_result: LazyFrame = if let Some(min) = &range_filter.min {
                    let min_val = min.try_val()?;
                    Ok::<LazyFrame, String>(result.filter(col(&range_filter.variable).gt(*min_val)))
                } else {
                    Ok(result)
                }?;

                let next_result = if let Some(max) = &range_filter.max {
                    let max_val = max.try_val()?;
                    Ok::<LazyFrame, String>(
                        next_result.filter(col(&range_filter.variable).lt(*max_val)),
                    )
                } else {
                    Ok(next_result)
                }?;

                Ok(next_result)
            }
            matico_spec::Filter::Category(category_filter) => {
                // if let Some(is_one_of) = category_filter.is_one_of {
                //     result = result.filter(col(&category_filter.variable).is_in([]))
                // }
                Ok(result)
            }
            matico_spec::Filter::Date(date_filter) => {
                // if let Some(min_d) = date_filter.min {
                //     let min_val = min_d.try_val()?;
                //     result = result.filter(col(&date_filter.variable).gt(min_val))
                // };
                //
                // if let Some(max_d) = date_filter.max {
                //     let max_val = max_d.try_val()?;
                //     result = result.filter(col(&date_filter.variable).lt(max_val))
                // };

                Ok(result)
            }
            matico_spec::Filter::RegEx(reg_ex_filter) => Ok(result.filter(
                col(&reg_ex_filter.variable)
                    .str()
                    .contains(lit(reg_ex_filter.regex), true),
            )),
        }
    })
}

pub struct RequestFetcher {}

#[async_trait]
impl DataFetcher for RequestFetcher {
    async fn fetch(url: &str) -> std::result::Result<Vec<u8>, String> {
        let response = reqwest::get(url)
            .await
            .map_err(|error| format!("Failed to download {} dataset {}", url, error))?;

        Ok(response.bytes().await.unwrap().into())
    }
}

impl<Fetcher> DataService<Fetcher>
where
    Fetcher: DataFetcher,
{
    pub fn new() -> DataService<Fetcher> {
        DataService {
            datasets: HashMap::new(),
            transforms: HashMap::new(),
            fetcher_type: PhantomData,
            plugin_instances: HashMap::new(),
            wasm_modules: HashMap::new(),
        }
    }

    pub fn run_plugin<S>(&mut self, name: S) -> anyhow::Result<()> {
        Ok(())
    }

    pub fn create_plugin_instance<S>(&mut self, name: S) -> anyhow::Result<()>
    where
        S: Into<String>,
    {
        let module = self
            .wasm_modules
            .get(&name.into())
            .context("No plugin registered by that name")?;

        let plugin = Plugin::new(&module)?;
        let id = Uuid::new_v4();
        self.plugin_instances.insert(id, plugin);
        Ok(())
    }

    pub fn register_plugin<S>(&mut self, name: S, wasm_binary: &[u8]) -> Result<(), String>
    where
        S: Into<String>,
    {
        println!("Creating store");
        let mut store = wasmer::Store::default();
        println!("Creating module");
        let module = Module::new(&mut store, &wasm_binary)
            .map_err(|e| format!("Failed to generate module"))?;
        println!("inserting module");
        self.wasm_modules.insert(name.into(), module);

        Ok(())
    }

    async fn load_dataset(spec: &RemoteSpecification) -> std::result::Result<Vec<u8>, String> {
        Fetcher::fetch(&spec.url).await
    }

    pub fn get_dataset(&self, id: &Uuid) -> Option<&Dataset> {
        self.datasets.get(&id)
    }

    fn apply_join_step(&self, df: LazyFrame, join_step: &JoinStep) -> Result<LazyFrame, String> {
        let id = Uuid::try_parse(&join_step.other_source_id)
            .map_err(|e| String::from("other source appears not to be a Uuid"))?;

        let other_dataset = self
            .get_dataset(&id)
            .ok_or_else(|| String::from("Failed to find dataset"))?;

        let other_data = other_dataset
            .data
            .clone()
            .ok_or_else(|| String::from("Data not loaded for dataset"))?;

        let left_join_cols: Vec<Expr> =
            join_step.join_columns_left.iter().map(|c| col(c)).collect();

        let right_join_cols: Vec<Expr> = join_step
            .join_columns_right
            .iter()
            .map(|c| col(c))
            .collect();

        Ok(df
            .join_builder()
            .how(match join_step.join_type {
                matico_spec::JoinType::Inner => JoinType::Inner,
                matico_spec::JoinType::Outer => JoinType::Outer,
                matico_spec::JoinType::Left => JoinType::Left,
                matico_spec::JoinType::Right => JoinType::Left,
            })
            .with(other_data.lazy())
            .left_on(left_join_cols)
            .right_on(right_join_cols)
            .suffix(&join_step.right_prefix)
            .finish())
    }

    pub fn generate_plan_for_transform(
        &self,
        base_dataset_id: &Uuid,
        steps: &[DatasetTransformStep],
    ) -> Result<LazyFrame, String> {
        let lazy: LazyFrame = self
            .get_dataset(base_dataset_id)
            .ok_or_else(|| format!("Failed to find dataset"))?
            .into();

        steps.iter().try_fold(lazy, |result, step| match step {
            DatasetTransformStep::Filter(filter) => apply_filter_step(result, &filter),
            DatasetTransformStep::Aggregate(agg_spec) => {
                Ok(apply_aggregate_step(result, &agg_spec))
            }
            DatasetTransformStep::Join(join) => self.apply_join_step(result, &join),
            DatasetTransformStep::Compute(_) => Ok(result),
            DatasetTransformStep::Sql(sql) => self.run_sql_step(result, &sql),
            DatasetTransformStep::ColumnTransformStep(_) => Ok(result),
        })
    }

    pub fn run_transform(
        &self,
        base_dataset_id: &Uuid,
        steps: &[DatasetTransformStep],
    ) -> Result<DataFrame, String> {
        let plan = self.generate_plan_for_transform(base_dataset_id, steps)?;

        plan.collect()
            .map_err(|e| format!("Something went wrong in the transformation {:#?}", e))
    }

    pub fn run_sql(&self, id: &Uuid, sql: &str) -> std::result::Result<DataFrame, String> {
        let mut context = SQLContext::new();

        context.register(
            "dataset",
            self.get_dataset(id).unwrap().data.clone().unwrap().lazy(),
        );

        let result: LazyFrame = context.execute(sql).map_err(|e| format!("error"))?;
        let result = result.collect().map_err(|e| format!("error 2"))?;
        Ok(result)
        // Err("Temporalially disabled".into())
    }

    pub fn run_sql_step(&self, df: LazyFrame, sql: &SQLStep) -> Result<LazyFrame, String> {
        let mut context = SQLContext::new();

        context.register(
            &sql.input_table_name
                .clone()
                .unwrap_or_else(|| "dataset".into()),
            df,
        );

        let result: LazyFrame = context
            .execute(&sql.sql)
            .map_err(|e| format!("SQL error {:#?}", e))?;
        Ok(result)
    }

    pub async fn register_dataset(
        &mut self,
        dataset: DatasetSpecification,
    ) -> std::result::Result<Uuid, String> {
        let id = Uuid::new_v4();
        self.datasets.insert(id, dataset.clone().into());
        let dataset = self.datasets.get_mut(&id).unwrap();

        match &dataset.specification {
            DatasetSpecification::Remote(spec) => {
                dataset.status = DataSourceStatus::Loading;
                let data = Self::load_dataset(spec).await?;
                let data_frame: DataFrame = data_to_frame(&data, &spec.format)?;
                dataset.data = Some(data_frame);
                dataset.status = DataSourceStatus::Ready;
                Ok(id)
            }
            DatasetSpecification::Inline(spec) => {
                let data_frame: DataFrame = data_to_frame(&spec.data, &spec.format)?;
                dataset.data = Some(data_frame);
                dataset.status = DataSourceStatus::Ready;
                Ok(id)
            }
        }
    }

    pub fn get_status(&self) -> &HashMap<Uuid, Dataset> {
        &self.datasets
    }
}
