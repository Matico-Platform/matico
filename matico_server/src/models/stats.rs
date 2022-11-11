use crate::{errors::ServiceError, models::Column as DatasetColumn};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use ts_rs::TS;

// Input structures
#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct EqualIntervalParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct LogorithmicParams {
    pub no_bins: usize,
    pub base: Option<f64>,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct JenksParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct QuantileParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct BasicStatsParams {
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct HistogramParams {
    pub treat_null_as_zero: Option<bool>,
    pub inclusive_bins: Option<bool>,
    pub no_bins: usize,
    pub bin_edges: Option<Vec<f64>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ValueCountsParams {
    pub ignore_null: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase", tag = "type")]
#[ts(export)]
pub enum StatParams {
    Quantiles(QuantileParams),
    Jenks(JenksParams),
    Logorithmic(LogorithmicParams),
    BasicStats(BasicStatsParams),
    ValueCounts(ValueCountsParams),
    Histogram(HistogramParams),
}

// Output types for returning results

#[derive(Serialize, Deserialize, Debug, TS, FromRow)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct QuantileEntry {
    pub quantile: i32,
    pub bin_start: f64,
    pub bin_end: f64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct QuantileResults(pub Vec<QuantileEntry>);

#[derive(Serialize, Deserialize, Debug, TS, FromRow)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct JenksEntry {
    pub bin_start: f64,
    pub bin_end: f64,
    pub freq: i64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct JenksResults(pub Vec<JenksEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct LogorithmicResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
    pub values_bellow_zero: bool,
}

#[derive(Serialize, Deserialize, Debug, TS, FromRow)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct BasicStatsResults {
    pub min: f64,
    pub max: f64,
    pub mean: f64,
    pub total: f64,
    pub median: f64,
    pub count: u32,
}

#[derive(Serialize, Deserialize, Debug, TS, FromRow)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct ValueCountEntry {
    count: i32,
    name: String,
}

#[derive(Serialize, Deserialize, Debug, TS, FromRow)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct HistogramEntry {
    bin_start: f64,
    bin_end: f64,
    bin_mid: f64,
    freq: f64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct HistogramResults(pub Vec<HistogramEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValueCountsResults(pub Vec<ValueCountEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub enum StatResults {
    Quantiles(QuantileResults),
    Jenks(JenksResults),
    Logotithmic(LogorithmicParams),
    BasicStats(BasicStatsResults),
    ValueCounts(ValueCountsResults),
    Histogram(HistogramResults),
}

#[async_trait]
pub trait StatRunner<T, A> {
    async fn calculate_stat(
        db: &T,
        column: &DatasetColumn,
        stat_params: &StatParams,
        query_builder: &A,
    ) -> Result<StatResults, ServiceError>;
}
