import { ScatterplotComponent } from './ScatterplotComponent';
import { BarComponent } from './BarComponent';
import { LineComponent } from './LineComponent';
import { PieChartComponent } from './PieChartComponent';
import { DistributionPlotComponent } from './DistributionPlotComponent';
// import { HeatmapComponent } from './HeatmapComponent';

const PlotComponentMapping = {
  'scatter': ScatterplotComponent,
  'line': LineComponent,
  'bar': BarComponent,
  'pie': PieChartComponent,
  'dist': DistributionPlotComponent,
  // 'heatmap': HeatmapComponent,
};

export {
    BarComponent,
    ScatterplotComponent,
    LineComponent,
    PieChartComponent,
    DistributionPlotComponent,
    // HeatmapComponent,
    PlotComponentMapping
}
