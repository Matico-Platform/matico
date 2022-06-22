import type { BasicStatsParams } from "./BasicStatsParams";
import type { HistogramParams } from "./HistogramParams";
import type { JenksParams } from "./JenksParams";
import type { LogorithmicParams } from "./LogorithmicParams";
import type { QuantileParams } from "./QuantileParams";
import type { ValueCountsParams } from "./ValueCountsParams";

export type StatParams = { Quantiles: QuantileParams } | { Jenks: JenksParams } | { Logorithmic: LogorithmicParams } | { BasicStats: BasicStatsParams } | { ValueCounts: ValueCountsParams } | { Histogram: HistogramParams };