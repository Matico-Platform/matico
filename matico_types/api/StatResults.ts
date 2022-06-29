import type { BasicStatsResults } from "./BasicStatsResults";
import type { HistogramResults } from "./HistogramResults";
import type { JenksResults } from "./JenksResults";
import type { LogorithmicParams } from "./LogorithmicParams";
import type { QuantileResults } from "./QuantileResults";
import type { ValueCountsResults } from "./ValueCountsResults";

export type StatResults = { type: "quantiles" } & QuantileResults | { type: "jenks" } & JenksResults | { type: "logotithmic" } & LogorithmicParams | { type: "basicStats" } & BasicStatsResults | { type: "valueCounts" } & ValueCountsResults | { type: "histogram" } & HistogramResults;