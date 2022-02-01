import React from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { PanePosition } from '@maticoapp/matico_spec'
import Draggable from "react-draggable";

const FreeArea = styled.div`
  position: relative;
  width:100%;
  height:100%;
  flex:1;
`

const FreePane = styled(Box) <{ pane: PanePosition }>`
  position: absolute;
  width:${({ pane }) => `${pane.width}${pane.width_units === "Percent" ? '%' : 'px' }`};
  height:${({ pane }) => `${pane.height}${pane.height_units ==="Percent" ? '%' : 'px' }`};
  z-index:${({ pane }) => `${pane.layer}`};
  left:${({ pane }) => `${pane.x}${pane.x_units ==="Percent" ? '%' : 'px' }`};
  bottom:${({ pane }) => `${pane.y}${pane.y_units ==="Percent" ? '%' : 'px' }`};
  cursor:${({ pane }) => pane.float ? 'grab' : 'pointer'};
  background:${({ pane }) => pane.background ? pane.background : 'white'};
  transition: bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms;
`

interface MaticoFreeLayoutInterface {

}

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({ children }) => {
  return <FreeArea>
    {React.Children.map(children, child => {
      //@ts-ignore
      //TODO Make this properly typed. Properly check to ensure that the child nodes implement MaticoPaneInterface 
      const pane = (<FreePane elevation={'medium'} key={child.props.name} pane={child.props.position} className="FreePane" >
        {child}
      </FreePane>)

      //@ts-ignore
      return child.props.float ? <Draggable>{pane}</Draggable> : pane

    })}
  </FreeArea>
}
