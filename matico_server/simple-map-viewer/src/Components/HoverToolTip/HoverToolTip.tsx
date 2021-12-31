import React from 'react'
import {Styles} from './HoverToolTipStyles'

interface HoverToolTip{
    x:number,
    y:number,
    info: any
}

export const HoverToolTip: React.FC<HoverToolTip>= ({x,y,info})=>{
    console.log("tool tip ", x,y,info)
    return(
        <Styles.HoverToolTip x={x} y={y}>
            <Styles.PropertiesTable>
                <tbody>
                {Object.entries(info).map((kv: [string, any])=>(
                    <Styles.Property>
                        <Styles.PropertyName>{kv[0]}</Styles.PropertyName>
                        <Styles.PropertyVal>{kv[1]}</Styles.PropertyVal>
                    </Styles.Property>
                 ))}
    </tbody>
            </Styles.PropertiesTable>
                                 </Styles.HoverToolTip>
    )
}