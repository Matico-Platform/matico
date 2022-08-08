import { ScatterplotComponent } from './ScatterplotComponent';
import { BarComponent } from './BarComponent';
import { LineComponent } from './LineComponent';
import { PieChartComponent } from './PieChartComponent';
import { DistributionPlotComponent2 } from './ViolinPlotComponent/index2';
// import { HeatmapComponent } from './HeatmapComponent';

const PlotComponentMapping = {
  'scatter': ScatterplotComponent,
  'line': LineComponent,
  'bar': BarComponent,
  'pie': PieChartComponent,
  'dist': DistributionPlotComponent2,
  // 'heatmap': HeatmapComponent,
};

export {
    BarComponent,
    ScatterplotComponent,
    LineComponent,
    PieChartComponent,
    DistributionPlotComponent2,
    // HeatmapComponent,
    PlotComponentMapping
}