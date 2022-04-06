import type { BasicStatsResults } from "./BasicStatsResults";
import type { JenksResults } from "./JenksResults";
import type { LogorithmicParams } from "./LogorithmicParams";
import type { QuantileResults } from "./QuantileResults";
import type { ValueCountsResults } from "./ValueCountsResults";
import type { HistogramResults } from "./HistogramResults";

export type StatResults = { Quantiles: QuantileResults } | { Jenks: JenksResults } | { Logotithmic: LogorithmicParams } | { BasicStats: BasicStatsResults } | { ValueCounts: ValueCountsResults } | { Histogram: HistogramResults };