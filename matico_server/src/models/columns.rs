use crate::db::queries::{Bounds, PostgisQueryRunner};
use crate::db::DataDbPool;
use crate::errors::ServiceError;
use crate::utils::Format;
use ts_rs::TS;
use log::info;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct EqualIntervalParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug,  TS)]
#[ts(export)]
pub struct LogorithmicParams {
    pub no_bins: usize,
    pub base: Option<f64>,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct JenksParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct QuantileParams {
    pub no_bins: usize,
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct BasicStatsParams {
    pub treat_null_as_zero: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct HistogramParams {
    treat_null_as_zero: Option<bool>,
    inclusive_bins: Option<bool>,
    no_bins: usize,
    bin_edges: Option<Vec<f64>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValueCountsParams {
    pub ignore_null: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum StatParams {
    Quantiles(QuantileParams),
    Jenks(JenksParams),
    Logorithmic(LogorithmicParams),
    BasicStats(BasicStatsParams),
    ValueCounts(ValueCountsParams),
    Histogram(HistogramParams),
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct QuantileEntry{
    pub quantile: u32,
    pub bin_start: f32, 
    pub bin_end: f32
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct QuantileResults(Vec<QuantileEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct JenksResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct LogorithmicResults {
    pub bins: Vec<f32>,
    pub values: Vec<f32>,
    pub values_bellow_zero: bool,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct BasicStatsResults {
    pub min: f64,
    pub max: f64,
    pub mean: f64,
    pub total: f64,
    pub median: f64,
    pub count: usize,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
struct ValCountEntry {
    count: usize,
    name: String,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
struct HistogramEntry {
    bin_start: f64,
    bin_end: f64,
    bin_mid: f64,
    freq: f64,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct HistogramResults(Vec<HistogramEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct ValueCountsResults(Vec<ValCountEntry>);

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum StatResults {
    Quantiles(QuantileResults),
    Jenks(JenksResults),
    Logotithmic(LogorithmicParams),
    BasicStats(BasicStatsResults),
    ValueCounts(ValueCountsResults),
    Histogram(HistogramResults),
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
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
        _bounds: Option<Bounds>,
    ) -> Result<StatResults, ServiceError> {
        match stat_params {
            // StatParams::Percentiles(params) => self.calc_percentiles(conn, params).await,
            StatParams::ValueCounts(params) => self.calc_value_counts(conn, params).await,
            StatParams::BasicStats(params) => self.calc_basic_stats(conn, params).await,
            StatParams::Histogram(params) => self.calc_histogram(conn, params).await,
            StatParams::Quantiles(params) => self.calc_quantiles(conn,params).await,
            
            _ => Err(ServiceError::BadRequest("Stat not implemented".into())),
        }
    }

    async fn calc_quantiles(
        &self,
        db: &DataDbPool,
        params: QuantileParams,
    
    )-> Result<StatResults,ServiceError>{

        let _treat_nulls_as_zero = params.treat_null_as_zero.unwrap_or(false);

        let query =format!(
                "
                SELECT
                    ntile as quantile,
                    CAST(min({column}) AS FLOAT) AS bin_start,
                    CAST(max({column}) AS FLOAT) AS bin_end
                    FROM (
                        SELECT {column}, ntile({bins}) OVER (ORDER BY {column}) AS ntile FROM ({source_query}) as y ) x
                    GROUP BY ntile 
                    ORDER BY ntile
                ",
                column = self.name,
                source_query = self.source_query,
                bins = params.no_bins
            );

        let json = PostgisQueryRunner::run_query(db, &query, None, None, Format::Json).await?;
        info!("JSON RESPONSE {:?}",json);
        let results: QuantileResults =
            serde_json::from_value(json).expect("Failed to deserialize quantiles response");
        Ok(StatResults::Quantiles(results))
    }

    async fn calc_histogram(
        &self,
        db: &DataDbPool,
        params: HistogramParams,
    ) -> Result<StatResults, ServiceError> {
        let _treat_nulls_as_zero = params.treat_null_as_zero.unwrap_or(false);

        let query = match params.bin_edges {
            Some(edges) => format!("We have not yet implemented custom bin edges {:?}", edges),
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

        let json = PostgisQueryRunner::run_query(db, &query, None, None, Format::Json).await?;
        let results: HistogramResults =
            serde_json::from_value(json).expect("Failed to deserialize histogram response");
        Ok(StatResults::Histogram(results))
    }

    async fn calc_value_counts(
        &self,
        db: &DataDbPool,
        _params: ValueCountsParams,
    ) -> Result<StatResults, ServiceError> {
        let query = format!(
            "
            select COALESCE({}::TEXT,'undefined') as name, count(*) as count 
            from ({}) a
            group by COALESCE({}::TEXT,'undefined')
            order by count DESC",
            self.name, self.source_query, self.name
        );
        let json = PostgisQueryRunner::run_query(db, &query, None,None, Format::Json).await?;
        let results: ValueCountsResults =
            serde_json::from_value(json).expect("Failed to deserialize value count response");
        Ok(StatResults::ValueCounts(results))
    }

    async fn calc_basic_stats(
        &self,
        db: &DataDbPool,
        _params: BasicStatsParams,
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
            PostgisQueryRunner::run_query(db, &query, None, None, Format::Json).await?,
        )
        .expect("Failed to deserialize basic results response");

        let result = results
            .into_iter()
            .next()
            .expect("Did not get a response back from basic stats query");

        Ok(StatResults::BasicStats(result))
    }
}
