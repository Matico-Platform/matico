import { ScatterplotComponent } from "./ScatterplotComponent";
import { BarComponent } from "./BarComponent";
import { LineComponent } from "./LineComponent";
import { PieChartComponent } from "./PieChartComponent";
import { DistributionPlotComponent } from "./DistributionPlotComponent";
declare const PlotComponentMapping: {
  scatter: ({
    data,
    xScale,
    yScale,
    xAccessor,
    yAccessor,
    color,
    scale,
    shape,
    xOffset,
    yOffset,
  }: import("../types").ScatterSpec &
    import("../types").PlotLayersProperties) => JSX.Element | null;
  line: (
    props: import("../types").LineSpec & import("../types").PlotLayersProperties
  ) => JSX.Element | null;
  bar: (
    props: import("../types").BarSpec & import("../types").PlotLayersProperties
  ) => JSX.Element[];
  pie: (
    props: import("../types").PieSpec & import("../types").PlotLayersProperties
  ) => JSX.Element;
  dist: (
    props: import("../types").DistributionSpec &
      import("../types").PlotLayersProperties
  ) => JSX.Element;
};
export {
  BarComponent,
  ScatterplotComponent,
  LineComponent,
  PieChartComponent,
  DistributionPlotComponent,
  PlotComponentMapping,
};
