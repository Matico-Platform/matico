import React from 'react'
import styled from 'styled-components'
import { PanePosition } from '@maticoapp/matico_spec'
import Draggable from "react-draggable";
import { View } from '@adobe/react-spectrum';
import {PaneRef} from '@maticoapp/matico_types/spec';
import {ControlActionBar} from 'Components/MaticoEditor/Utils/ControlActionBar';
import {selectPane} from 'Utils/paneEngine';

/**
 * If the unit is percent, return percent, otherwise return pixels.
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleHorizontalUnits = (unit: string) => unit === "Percent" ? '%' : 'px'

/**
 * If the unit is Percent, return Viewport height, otherwise return px
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleVerticalUnits = (unit: string) => unit === "Percent" ? 'vh' : 'px'

/**
 * If the position is horizontal, then return the result of calling handleHorizontalUnits with the
 * unit, otherwise return the result of calling handleVerticalUnits with the unit.
 * @param {string} unit - string - The unit to be converted.
 * @param {'vertical' | 'horizontal'} position - 'vertical' | 'horizontal'
 */
const handleUnits = (unit: string, position: 'vertical' | 'horizontal') => position === 'horizontal' ? handleHorizontalUnits(unit) : handleVerticalUnits(unit)

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
    return values.map((value, index) => `${value || 0}${handleUnits(units[index] || '', index % 2 === 0 ? 'vertical' : 'horizontal')}`).join(' ')
  }
}


const LinearPane: React.FC<PanePosition> = ({
  width,
  height,
  layer,
  width_units,
  height_units,
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
    width={`${width}${handleHorizontalUnits(width_units)}`}
    height={`${height}${handleVerticalUnits(height_units)}`}
    maxWidth={"100%"}
    zIndex={layer}
    paddingBottom={`${pad_bottom}${handleVerticalUnits(pad_units_bottom)}`}
    paddingStart={`${pad_left}${handleVerticalUnits(pad_units_left)}`}
    paddingEnd={`${pad_right}${handleVerticalUnits(pad_units_right)}`}
    paddingTop={`${pad_top}${handleVerticalUnits(pad_units_top)}`}
    UNSAFE_style={{
      transition: 'bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms',
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)',
      boxSizing: 'border-box'
    }}
  >
    {children}
  </View>
}

interface MaticoLinearLayoutInterface {
  paneRefs:Array<PaneRef>
}

export const MaticoLinearLayout: React.FC<MaticoLinearLayoutInterface> = ({ paneRefs}) => {
  return <View position="relative" width="100%" height="100%">
    {paneRefs.map((paneRef:PaneRef)=> 
      <LinearPane
        key={paneRef.id}
        {...paneRef.position}
      >
        <ControlActionBar paneRef={paneRef}/>
        {selectPane(paneRef)}
      </LinearPane>
    )}
  </View>
}
