import React from 'react'
import {Section} from 'matico_spec'
import {Box} from 'grommet'
import {MaticoFreeLayout} from '../Layouts/MaticoFreeLayout/MaticoFreeLayout'
import {MaticoMapPane} from '../Panes/MaticoMapPane/MaticoMapPane'
import {MaticoTextPane} from '../Panes/MaticoTextPane/MaticoTextPane'
import { MaticoHistogramPane } from '../Panes/MaticoHistogramPane/MaticoHistogramPane'
import { MaticoScatterplotPane } from '../Panes/MaticoScatterplotPane/MaticoScatterplotPane'
import { MaticoPieChartPane } from '../Panes/MaticoPieChartPane/MaticoPieChartPane'
import {MaticoControlsPane} from '../Panes/MaticoControlsPane/MaticoControlsPane'

interface MaticoSectionInterface{
  section: Section
}

function selectLayout(layout_name: string){
  switch(layout_name){
    case "free":
      return MaticoFreeLayout
    default:
      return null
  }
}

const panes = {
  "Map": MaticoMapPane,
  "Text": MaticoTextPane,
  "Histogram": MaticoHistogramPane,
  "Scatterplot": MaticoScatterplotPane,
  "PieChart": MaticoPieChartPane,
  "Controls": MaticoControlsPane,
}

function selectPane(pane:any){
  const paneType = Object.keys(pane)[0]
  const PaneComponent = panes[paneType]
  
  if (!PaneComponent) return null;
  return <PaneComponent key={pane.name} {...pane[paneType]} />
}

export const MaticoSection: React.FC<MaticoSectionInterface> = ({section})=>{
  let LayoutEngine = selectLayout(section.layout) 
  return (
    <Box fill={true}>
      <LayoutEngine>
        {section.panes.map(pane =>(
          selectPane(pane) 
        ))}
      </LayoutEngine>
    </Box>
  ) 
}
