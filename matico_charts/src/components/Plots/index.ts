import { ScatterplotComponent } from "./ScatterplotComponent";
import { BarComponent } from "./BarComponent";
import { LineComponent } from "./LineComponent";
import { PieChartComponent } from "./PieChartComponent";
import { StaticMapComponent } from "./StaticMapComponent";
// import { HeatmapComponent } from './HeatmapComponent';

const PlotComponentMapping = {
  scatter: ScatterplotComponent,
  line: LineComponent,
  bar: BarComponent,
  pie: PieChartComponent,
  map: StaticMapComponent,
  // 'heatmap': HeatmapComponent,
};

export {
  BarComponent,
  ScatterplotComponent,
  LineComponent,
  PieChartComponent,
  StaticMapComponent,
  // HeatmapComponent,
  PlotComponentMapping,
};
