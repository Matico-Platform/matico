import React from 'react'
import styled from 'styled-components'
import { PanePosition } from '@maticoapp/matico_spec'
import Draggable from "react-draggable";
import { View } from '@adobe/react-spectrum';

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
    padding={handlePositionalRule(
      [pad_top, pad_right, pad_bottom, pad_left],
      [pad_units_top, pad_units_right, pad_units_bottom, pad_units_left]
    )}
    UNSAFE_style={{
      transition: 'bottom 250ms, left 250ms, width 250ms, height 250ms, background 250ms',
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)'
    }}
  >
    {children}
  </View>
}

interface MaticoLinearLayoutInterface {
  children: React.ReactNode[];
}

export const MaticoLinearLayout: React.FC<MaticoLinearLayoutInterface> = ({ children }) => {
  return <View position="relative" width="100%" height="100%">
    {React.Children.map(children, child => {
      //@ts-ignore
      const positionProps = child.props.position;
      //@ts-ignore
      //TODO Make this properly typed. Properly check to ensure that the child nodes implement MaticoPaneInterface 
      const pane = <LinearPane
        //@ts-ignore
        key={child.props.name}
        {...positionProps}
      >
        {child}
      </LinearPane>
      //@ts-ignore
      return child.props.float ? <Draggable>{pane}</Draggable> : pane

    })}
  </View>
}
