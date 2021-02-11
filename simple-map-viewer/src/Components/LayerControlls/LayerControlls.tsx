import React, {useState} from 'react'
import {Layer,PolygonStyle,PointStyle, LayerStyle} from '../../api'
import {Styles} from './LayerControllsStyles'
import {useDataset} from '../../Hooks/useDataset'
import { SketchPicker } from 'react-color';
import {useDashboard} from '../../Contexts/DashbardBuilderContext'
import { NumberLiteralType } from 'typescript';

interface LayerControllProps{
    layer: Layer
}
interface PolygonLayerControllsProps{
    style: PolygonStyle,
    onChange: (update:any)=>void
}
interface PointLayerControllsProps{
    style: PointStyle,
    onChange: (update:any)=>void
}

const PointLayerControlls: React.FC<PointLayerControllsProps>= ({onChange,style})=>{
    const [showFill, setShowFill] = useState(false)
    const [showStroke, setShowStroke] = useState(false)

    const pointStyle = style.Point;
    const fill = pointStyle.fill;
    const stroke = pointStyle.stroke;

    const fillColor = {r: fill[0], g: fill[1], b:fill[2], a:fill[3]/100.0}
    const strokeColor = {r: stroke[0], g: stroke[1], b:stroke[2], a:stroke[3]/100.0}
    const updateFill = (a:any)=>{
        const rgb: number[] = Object.values(a.rgb)
        onChange({Point:{
            ...pointStyle,
            fill: [rgb[0], rgb[1], rgb[2], rgb[3]*100.0]
        }})
    }
    const updateStroke= (a:any)=>{
        const rgb: number[] = Object.values(a.rgb)
        onChange({Point:{
            ...pointStyle,
            stroke:[rgb[0], rgb[1], rgb[2], rgb[3]*100.0]
        }})
    }

    const updateSize= (size:number)=>{
        onChange({Point:{
            ...pointStyle,
            size
        }})
    }
    return(
        <>
            <section>
            <label>Fill</label>
            <Styles.ColorBar onClick={()=>setShowFill(!showFill)} c={fillColor}/>
            {showFill &&
                <SketchPicker onChange={updateFill} color={fillColor}/>
            }
            </section>
            <section>
                <label>Stroke</label>
                <Styles.ColorBar onClick={()=>setShowStroke(!showStroke)} c={strokeColor}/>
                {showStroke && 
                    <SketchPicker onChange={updateStroke} color={strokeColor}/>
                }
            </section>
            <section>
                <label>Size</label>
            <input value={pointStyle.size} type='number' onChange={(e)=>updateSize(parseFloat(e.target.value))} />
            </section>
        </>
    )
}

const PolygonLayerControlls: React.FC<PolygonLayerControllsProps>= ({onChange,style})=>{
    const [showFill, setShowFill] = useState(false)
    const [showStroke, setShowStroke] = useState(false)

    const polygonStyle = style.Polygon;
    const fill = polygonStyle.fill;
    const stroke = polygonStyle.stroke;


    const fillColor = {r: fill[0], g: fill[1], b:fill[2], a:fill[3]/100.0}
    const strokeColor = {r: stroke[0], g: stroke[1], b:stroke[2], a:stroke[3]/100.0}
    const updateFill = (a:any)=>{
        const rgb: number[] = Object.values(a.rgb)
        onChange({Polygon:{
            ...polygonStyle,
            fill: [rgb[0], rgb[1], rgb[2], rgb[3]*100.0]
        }})
    }
    const updateStroke= (a:any)=>{
        const rgb: number[] = Object.values(a.rgb)
        onChange({Point:{
            ...polygonStyle,
            stroke: [rgb[0], rgb[1], rgb[2], rgb[3]*100.0]
        }})
    }
    return(
        <>
            <section>
                <label>Fill</label>
                <Styles.ColorBar onClick={()=>setShowFill(!showFill)} c={fillColor}/>
                {showFill &&
                    <SketchPicker onChange={updateFill} color={fillColor}/>
                }
            </section>
            <section>
                <label>Stroke</label>
                <Styles.ColorBar onClick={()=>setShowStroke(!showStroke)} c={strokeColor}/>
                {showStroke && 
                    <SketchPicker onChange={updateStroke} color={strokeColor}/>
                }
            </section>
        </>
    )
}

export const LayerControlls: React.FC<LayerControllProps>=({layer})=>{
    const sourceType = Object.keys(layer.source)[0];
    const styleType = Object.keys(layer.style)[0]
    const {updateLayerStyle} = useDashboard()

    const updateStyle=(update:LayerStyle)=>{
        console.log("Update style is ",update)
        updateLayerStyle(layer.name, update)
    }
    return(
        <Styles.LayerControlls>
            <h3>{layer.name}</h3>
            {styleType == 'Polygon' &&
                <PolygonLayerControlls onChange={updateStyle} style={(layer.style as PolygonStyle)}/>
            }
            {styleType == 'Point' &&
                <PointLayerControlls onChange={updateStyle} style={(layer.style as PointStyle)}/>
            }
        </Styles.LayerControlls>
    )
}

