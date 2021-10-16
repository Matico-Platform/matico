import React from 'react'
import {Section} from 'matico_spec'
import {Box} from 'grommet'
import {MaticoFreeLayout} from '../Layouts/MaticoFreeLayout/MaticoFreeLayout'
import {MaticoMapPane} from '../Panes/MaticoMapPane/MaticoMapPane'

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
      return <MaticoMapPane {...pane.Map} />
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
