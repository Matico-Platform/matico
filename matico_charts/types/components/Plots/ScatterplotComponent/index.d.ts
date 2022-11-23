import { PlotLayersProperties, ScatterSpec } from "../../types";
export declare const ScatterplotComponent: ({
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
}: ScatterSpec & PlotLayersProperties) => JSX.Element | null;
