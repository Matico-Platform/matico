import React from 'react'
import styled from 'styled-components'
import { Box } from 'grommet'
import { PanePosition } from '@maticoapp/matico_spec'
import {DndContext, useDraggable} from '@dnd-kit/core'
import {View} from "@adobe/react-spectrum"

const FreeArea = styled.div`
  position: relative;
  width:100%;
  height:100%;
  flex:1;
`

// const FreePane = styled(Box) <{ pane: PanePosition }>`
//   position: absolute;
//   width:${({ pane }) => `${pane.width}${pane.width_units === "Percent" ? '%' : 'px' }`};
//   height:${({ pane }) => `${pane.height}${pane.height_units ==="Percent" ? '%' : 'px' }`};
//   z-index:${({ pane }) => `${pane.layer}`};
//   left:${({ pane }) => `${pane.x}${pane.x_units ==="Percent" ? '%' : 'px' }`};
//   bottom:${({ pane }) => `${pane.y}${pane.y_units ==="Percent" ? '%' : 'px' }`};
//   cursor:${({ pane }) => pane.float ? 'grab' : 'pointer'};
//   background:${({ pane }) => pane.background ? pane.background : 'white'};
//    transition: bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms;
// `

interface MaticoFreeLayoutInterface {

}

const FreePane :React.FC<{pane:PanePosition, name: string}> =({pane,name, children})=>{
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: name,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  const baseStyle = {
    width:pane.width,
    height:pane.height,
  }

  return(
    <div ref={setNodeRef} style={{...style, ...baseStyle}} {...listeners} {...attributes} >
      {children}
    </div>
  )
} 

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({ children }) => {
  return <FreeArea>
    <DndContext onDragEnd={(dragEndEvent)=> console.log("Drag end ", dragEndEvent)}>
      {React.Children.map(children, child => {
        //@ts-ignore
        //TODO Make this properly typed. Properly check to ensure that the child nodes implement MaticoPaneInterface 
        const pane = (<FreePane  key={child.props.name} name={child.props.name} pane={child.props.position} >
          {child}
        </FreePane>)

        //@ts-ignore
        return child.props.float ? <Draggable>{pane}</Draggable> : pane

      })}
    </DndContext>
  </FreeArea>
}
