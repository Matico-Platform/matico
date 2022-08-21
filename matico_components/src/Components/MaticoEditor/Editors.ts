import {MapPaneEditor} from './Panes/MapPaneEditor'
import {ScatterplotPaneEditor} from './Panes/ScatterPlotPaneEditor'
import {HistogramPaneEditor} from './Panes/HistogramPaneEditor'
import {PieChartPaneEditor} from './Panes/PieChartPaneEditor'
import {ContainerPaneEditor} from './Panes/ContainerPaneEditor'
import {TextPaneEditor} from './Panes/TextPaneEditor'
import {LayerEditor} from './Panes/LayerEditor'
import {ControlsPaneEditor} from './Panes/ControlsEditor'
import {StaticMapPaneEditor} from './Panes/StaticMapEditor'


export const Editors ={
  container: ContainerPaneEditor,
  scatterplot: ScatterplotPaneEditor,
  map: MapPaneEditor ,
  text: TextPaneEditor,
  histogram: HistogramPaneEditor,
  pieChart: PieChartPaneEditor,
  layer: LayerEditor,
  controls:ControlsPaneEditor,
  staticMap: StaticMapPaneEditor
}
