import type { QuantileParams } from "./QuantileParams";
import type { ValueCountsParams } from "./ValueCountsParams";
import type { JenksParams } from "./JenksParams";
import type { LogorithmicParams } from "./LogorithmicParams";
import type { HistogramParams } from "./HistogramParams";
import type { BasicStatsParams } from "./BasicStatsParams";

export type StatParams = { Quantiles: QuantileParams } | { Jenks: JenksParams } | { Logorithmic: LogorithmicParams } | { BasicStats: BasicStatsParams } | { ValueCounts: ValueCountsParams } | { Histogram: HistogramParams };