import React from 'react'
import styled from 'styled-components'
import { PanePosition } from '@maticoapp/matico_spec'
import Draggable from "react-draggable";
import { View } from '@adobe/react-spectrum';

const FreeArea = styled.div`
  position: relative;
  width:100%;
  height:100%;
  flex:1;
`

const FreePane: React.FC<PanePosition> = ({width, height, layer, width_units, height_units, x, x_units, y, y_units, children}) => {
  return <View
    position="absolute"
    width={`${width}${width_units === "Percent" ? '%' : 'px'}`}
    height={`${height}${height_units === "Percent" ? '%' : 'px'}`}
    zIndex={layer}
    left={`${x}${x_units === "Percent" ? '%' : 'px'}`}
    bottom={`${y}${y_units === "Percent" ? '%' : 'px'}`}
    UNSAFE_style={{
      transition: 'bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms',
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)'
    }}
    >
    {children}
  </View>
}

interface MaticoFreeLayoutInterface {

}

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({ children }) => {
  return <FreeArea>
    {React.Children.map(children, child => {
      //@ts-ignore
      const positionProps = child.props.position;
      //@ts-ignore
      //TODO Make this properly typed. Properly check to ensure that the child nodes implement MaticoPaneInterface 
      const pane = <FreePane
        //@ts-ignore
        key={child.props.name} 
        {...positionProps}
        >
        {child}
      </FreePane>
      //@ts-ignore
      return child.props.float ? <Draggable>{pane}</Draggable> : pane

    })}
  </FreeArea>
}
