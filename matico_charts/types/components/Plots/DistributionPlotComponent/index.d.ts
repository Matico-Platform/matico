import { DistributionSpec, PlotLayersProperties } from "../../types";
export declare type StatsPlotProps = {
  width: number;
  height: number;
};
export declare const DistributionPlotComponent: (
  props: DistributionSpec & PlotLayersProperties
) => JSX.Element;
