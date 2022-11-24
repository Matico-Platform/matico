// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { BasicStatsParams } from "./BasicStatsParams";
import type { HistogramParams } from "./HistogramParams";
import type { JenksParams } from "./JenksParams";
import type { LogorithmicParams } from "./LogorithmicParams";
import type { QuantileParams } from "./QuantileParams";
import type { ValueCountsParams } from "./ValueCountsParams";

export type StatParams =
  | ({ type: "quantiles" } & QuantileParams)
  | ({ type: "jenks" } & JenksParams)
  | ({ type: "logorithmic" } & LogorithmicParams)
  | ({ type: "basicStats" } & BasicStatsParams)
  | ({ type: "valueCounts" } & ValueCountsParams)
  | ({ type: "histogram" } & HistogramParams);
