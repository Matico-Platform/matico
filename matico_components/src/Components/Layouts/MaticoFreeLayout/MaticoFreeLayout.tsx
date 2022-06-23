import React from 'react'
import styled from 'styled-components'
import { PanePosition } from '@maticoapp/matico_spec'
import Draggable from "react-draggable";
import { View } from '@adobe/react-spectrum';
import {PaneRef} from '@maticoapp/matico_types/spec';
import {PaneSelector} from 'Utils/paneEngine';
import {ControlActionBar} from 'Components/MaticoEditor/Utils/ControlActionBar';

const FreeArea = styled.div`
  position: relative;
  width:100%;
  height:100%;
  flex:1;
`
/**
 * If the unit is Percent, return %, otherwise return px.
 * @param {string} unit - The unit of the value.
 */
const handleUnits = (unit: string) => unit === "Percent" ? '%' : 'px'

/**
 * If the values and units are not undefined, then map over the values and units and join them together
 * with a space, for use in the style attribute.
 * @param {Array<number | undefined>} values - number[] | undefined
 * @param {Array<string | undefined>} units - string[] | undefined
 * @returns A string.
 */
const handlePositionalRule = (values: Array<number | undefined>, units: Array<string | undefined>) => {
  if (!values || !units) {
    return 'auto'
  } else {
    return values.map((value, index) => `${value || 0}${handleUnits(units[index] || '')}`).join(' ')
  }
}


const FreePane: React.FC<PanePosition> = ({ 
  width, 
  height, 
  layer, 
  width_units, 
  height_units, 
  x, 
  x_units, 
  y, 
  y_units, 
  pad_left, 
  pad_right, 
  pad_bottom, 
  pad_top, 
  pad_units_left, 
  pad_units_right, 
  pad_units_bottom, 
  pad_units_top, 
  children 
}) => {
  return <View
    position="absolute"
    width={`${width}${handleUnits(width_units)}`}
    height={`${height}${handleUnits(height_units)}`}
    zIndex={layer}
    left={`${x}${handleUnits(x_units)}`}
    bottom={`${y}${handleUnits(y_units)}`}
    backgroundColor={"static-black"}
    paddingBottom={`${pad_bottom}${handleUnits(pad_units_bottom)}`}
    paddingStart={`${pad_left}${handleUnits(pad_units_left)}`}
    paddingEnd={`${pad_right}${handleUnits(pad_units_right)}`}
    paddingTop={`${pad_top}${handleUnits(pad_units_top)}`}
    UNSAFE_style={{
      transition: 'bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms',
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)',
      boxSizing: 'border-box'
    }}
    id="testtest"
  >
    {children}
  </View>
}

interface MaticoFreeLayoutInterface {
  paneRefs: Array<PaneRef>
}

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({paneRefs}) => {
  return <FreeArea>
    {paneRefs.map( (paneRef) => 
      <FreePane
        //@ts-ignore
        key={paneRef.id}
        {...paneRef.position}
      >
        <ControlActionBar paneRef={paneRef} />
        <PaneSelector paneRef={paneRef}/>
      </FreePane>
    )}
  </FreeArea>
}
