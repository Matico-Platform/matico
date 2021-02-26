import React from 'react'
import {SingleColor} from '../types'
import { SketchPicker } from 'react-color';


interface SingleColorSelectorProps {
    colorSpecification: SingleColor,
    onChange: (colorSpecification: SingleColor)=>void
}
export const SingleColorSelector: React.FC<SingleColorSelectorProps> =({onChange, colorSpecification})=>{
    const updateColor = (color:any)=>{
        const newColor= new SingleColor(
           color.r,
           color.g,
           color.b,
           color.a*100.0,
        ) 
        onChange(newColor)
    }
    return <SketchPicker onChange={updateColor} color={colorSpecification} />

}