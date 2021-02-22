use crate::db::queries::{Bounds, PostgisQueryRunner};
use crate::db::DataDbPool;
use crate::errors::ServiceError;
use crate::utils::Format;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct EqualIntervalParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LogorithmicParams {
    pub no_bins: usize,
    pub base: Option<f64>,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JenksParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PercentilesParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BasicStatsParams {
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HistogramParams {
    treat_null_as_zero: Option<bool>,
    inclusive_bins: Option<bool>,
    no_bins: usize,
    bin_edges: Option<Vec<f64>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ValueCountsParams {
    pub ignore_null: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum StatParams {
    Percentiles(PercentilesParams),
    Jenks(JenksParams),
    Logorithmic(LogorithmicParams),
    BasicStats(BasicStatsParams),
    ValueCounts(ValueCountsParams),
    Histogram(HistogramParams),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PercentilesResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct JenksResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LogorithmicResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
    pub values_bellow_zero: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BasicStatsResults {
    pub min: f64,
    pub max: f64,
    pub mean: f64,
    pub total: f64,
    pub median: f64,
    pub count: usize,
}

#[derive(Serialize, Deserialize, Debug)]
struct ValCountEntry {
    count: usize,
    name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct HistogramEntry {
    bin_start: f64,
    bin_end: f64,
    bin_mid: f64,
    freq: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HistogramResults(Vec<HistogramEntry>);

#[derive(Serialize, Deserialize, Debug)]
pub struct ValueCountsResults(Vec<ValCountEntry>);

#[derive(Serialize, Deserialize, Debug)]
pub enum StatResults {
    Percentiles(PercentilesResults),
    Jenks(JenksResults),
    Logotithmic(LogorithmicParams),
    BasicStats(BasicStatsResults),
    ValueCounts(ValueCountsResults),
    Histogram(HistogramResults),
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Column {
    pub name: String,
    pub col_type: String,
    pub source_query: String,
}

impl Column {
    pub async fn calc_stat(
        &self,
        conn: &DataDbPool,
        stat_params: StatParams,
        bounds: Option<Bounds>,
    ) -> Result<StatResults, ServiceError> {
        match stat_params {
            // StatParams::Percentiles(params) => self.calc_percentiles(conn, params).await,
            StatParams::ValueCounts(params) => self.calc_value_counts(conn, params).await,
            StatParams::BasicStats(params) => self.calc_basic_stats(conn, params).await,
            StatParams::Histogram(params) => self.calc_histogram(conn, params).await,
            _ => Err(ServiceError::BadRequest("Stat not implemented".into())),
        }
    }

    async fn calc_histogram(
        &self,
        db: &DataDbPool,
        params: HistogramParams,
    ) -> Result<StatResults, ServiceError> {
        let _treat_nulls_as_zero = params.treat_null_as_zero.unwrap_or(false);

        let query = match params.bin_edges {
            Some(edges) => format!("TEST"),
            None => format!(
                "
                select  bin_no,
                        bin_no *(max-min)/{bin_no} as bin_start, 
                        (bin_no +1 ) * (max-min)/{bin_no} as bin_end,
                        (bin_no +0.5 ) * (max-min)/{bin_no} as bin_mid,
                        count(*) as freq
                FROM (
                        select width_bucket({col}::NUMERIC, min, max, {bin_no}) as bin_no
                        from ({source_query}) as query,
                        ( select max({col}::NUMERIC) as max,
                                 min({col}::NUMERIC) as min
                          FROM ({source_query}) as sq 
                        ) as    stats
                    ) iq,
                    ( select max({col}::NUMERIC) as max,
                             min({col}::NUMERIC) as min
                          FROM ({source_query}) as sq 
                    ) as    stats
                        group by bin_no, stats.max, stats.min
                        order by bin_no
                ",
                col = self.name,
                source_query = self.source_query,
                bin_no = params.no_bins
            ),
        };

        let json = PostgisQueryRunner::run_query(&db, &query, None, Format::JSON).await?;
        let results: HistogramResults =
            serde_json::from_value(json).expect("Failed to deserialize histogram response");
        Ok(StatResults::Histogram(results))
    }

    async fn calc_percentiles(
        &self,
        conn: &DataDbPool,
        params: PercentilesParams,
    ) -> Result<StatResults, ServiceError> {
        Ok(StatResults::Percentiles(PercentilesResults {
            bins: vec![],
            values: vec![],
        }))
    }

    async fn calc_value_counts(
        &self,
        db: &DataDbPool,
        params: ValueCountsParams,
    ) -> Result<StatResults, ServiceError> {
        let query = format!(
            "
            select COALESCE({},'undefined') as name, count(*) as count 
            from ({}) a
            group by COALESCE({},'undefined')",
            self.name, self.source_query, self.name
        );
        let json = PostgisQueryRunner::run_query(&db, &query, None, Format::JSON).await?;
        let results: ValueCountsResults =
            serde_json::from_value(json).expect("Failed to deserialize value count response");
        Ok(StatResults::ValueCounts(results))
    }

    async fn calc_basic_stats(
        &self,
        db: &DataDbPool,
        params: BasicStatsParams,
    ) -> Result<StatResults, ServiceError> {
        let query = format!(
            "select max({col}::NUMERIC) as max,
                    min({col}::NUMERIC) as min,
                    avg({col}::NUMERIC) as mean,
                    sum({col}::NUMERIC) as total,
                    count({col}::NUMERIC) as count,
                    avg({col}::NUMERIC) as median
                    from ({query}) b 
                    ",
            col = self.name,
            query = self.source_query
        );

        let results: Vec<BasicStatsResults> = serde_json::from_value(
            PostgisQueryRunner::run_query(&db, &query, None, Format::JSON).await?,
        )
        .expect("Failed to deserialize basic results response");

        let result = results
            .into_iter()
            .nth(0)
            .expect("Did not get a response back from basic stats query");

        Ok(StatResults::BasicStats(result))
    }
}
