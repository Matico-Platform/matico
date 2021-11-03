import React from 'react'
import {Section} from 'matico_spec'
import {Box} from 'grommet'
import {MaticoFreeLayout} from '../Layouts/MaticoFreeLayout/MaticoFreeLayout'
import {MaticoMapPane} from '../Panes/MaticoMapPane/MaticoMapPane'
import {MaticoTextPane} from '../Panes/MaticoTextPane/MaticoTextPane'
import { MaticoHistogramPane } from '../Panes/MaticoHistogramPane/MaticoHistogramPane'
import { MaticoScatterplotPane } from '../Panes/MaticoScatterplotPane/MaticoScatterplotPane'

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

function selectPane(pane:any){
  switch(Object.keys(pane)[0]){
    case "Map":
      return <MaticoMapPane key={pane.name} {...pane.Map} />
    case "Text":
      return <MaticoTextPane  key={pane.name} {...pane.Text} />
    case "Histogram":
      return <MaticoHistogramPane key={pane.name} {...pane.Histogram} />
    case "Scatterplot":
      return <MaticoScatterplotPane key={pane.name} {...pane.Scatterplot} />
    default:
      return null
  }
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
