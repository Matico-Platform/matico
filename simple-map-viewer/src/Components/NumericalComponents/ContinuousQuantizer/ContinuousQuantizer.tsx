import React from 'react'
import {ScaleFunc} from 'api'
import {Styles} from './ContinuousQuantizerStyles'
import {SimpleSwitch} from 'Components/SimpleSwitch/SimpleSwitch'

interface ContinuousQuantizerProps{
    scaleFunc: ScaleFunc,
    onScaleFuncChanged: (scale: ScaleFunc)=>void
}
export const ContinuousQuantizer: React.FC<ContinuousQuantizerProps> = ({scaleFunc, onScaleFuncChanged})=>{

    //@ts-ignore
    const setScaleFunc = (scale:string)=> ScaleFunc[scale]

    return(
        <Styles.ContinuousQuantizer>
            <p>Scaling to use</p>

            <SimpleSwitch options={Object.keys(ScaleFunc)}
            selected = {ScaleFunc[scaleFunc]}
            onChange ={(scale: string)=> setScaleFunc(scale)}
            />

        </Styles.ContinuousQuantizer>
    )
}