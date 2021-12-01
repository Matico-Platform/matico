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
  section: Section,
  editPath?: string
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

function selectPane(pane:any,editPath:string){
  const paneType = Object.keys(pane)[0]
  const PaneComponent = panes[paneType]
  
  if (!PaneComponent) return null;
  return <PaneComponent key={pane.name} {...pane[paneType]} editPath={`${editPath}`} />
}

export const MaticoSection: React.FC<MaticoSectionInterface> = ({section,editPath})=>{
  let LayoutEngine = selectLayout(section.layout) 
  return (
    <Box fill={true}>
      <LayoutEngine>
        {section.panes.filter(p=>p).map( (pane, index)=>(
          selectPane(pane,`${editPath}.panes.${index}`) 
        ))}
      </LayoutEngine>
    </Box>
  ) 
}
