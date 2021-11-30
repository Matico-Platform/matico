import {MapPaneEditor} from './MapPaneEditor'
import {PageEditor} from './PageEditor'
import {ScatterplotPaneEditor} from './ScatterPlotPaneEditor'
import {HistogramPaneEditor} from './HistogramPaneEditor'
import {PieChartPaneEditor} from './PieChartPaneEditor'
import {SectionEditor} from './SectionEditor'
import {TextPaneEditor} from './TextPaneEditor'


export const Editors ={
  Page: PageEditor,
  Section: SectionEditor,
  Scatterplot: ScatterplotPaneEditor,
  Map: MapPaneEditor ,
  Text: TextPaneEditor,
  Histogram: HistogramPaneEditor,
  PieChart: PieChartPaneEditor
}
