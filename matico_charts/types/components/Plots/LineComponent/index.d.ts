import { LineSpec, PlotLayersProperties } from "../../types";
export declare const intervalPartitioner: (interval: number[]) => number[];
export declare const LineComponent: (
  props: LineSpec & PlotLayersProperties
) => JSX.Element | null;
