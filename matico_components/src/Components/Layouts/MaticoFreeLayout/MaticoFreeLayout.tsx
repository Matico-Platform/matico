import React from 'react'
import styled from 'styled-components'
import {Box} from 'grommet'
import { PanePosition} from 'matico_spec'

const FreeArea = styled.div`
  position: relative;
  width:100%;
  height:100%;
  flex:1;
`

const FreePane = styled.div<{pane:PanePosition}>`
  position: absolute;
  width:${({pane})=> `${pane.width}%`};
  height:${({pane})=> `${pane.height}%`};
  z-index:${({pane})=> `${pane.layer}`};
  left:${({pane})=> `${pane.x}%`};
  bottom:${({pane})=>`${pane.y}%`};
  background: blue;
`

interface MaticoFreeLayoutInterface{

}



export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> =({children})=>{
  return <FreeArea>
    {React.Children.map(children, child=>(
      //@ts-ignore
      //Make this properly typed 
      <FreePane pane={child.props.position} className="FreePane">
        {child}
      </FreePane>
    ))}
  </FreeArea>
}
