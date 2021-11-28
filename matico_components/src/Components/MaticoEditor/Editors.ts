import {MapPaneEditor} from './MapPaneEditor'
import {PageEditor} from './PageEditor'
import {ScatterplotPaneEditor} from './ScatterPlotPaneEditor'
import {SectionEditor} from './SectionEditor'
import {TextPaneEditor} from './TextPaneEditor'


export const Editors ={
  Page: PageEditor,
  Section: SectionEditor,
  Scatterplot: ScatterplotPaneEditor,
  Map: MapPaneEditor ,
  Text: TextPaneEditor
}
