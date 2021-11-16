import React from "react"
import {Box,Text} from 'grommet'
import {MaticoPaneInterface} from "../Pane"
import {MaticoControl} from '../../Controls'
import {MaticoRangeControl} from "./MaticoRangeControl"
import {MaticoSelectControl} from "./MaticoSelectControl"

interface MaticoControlPaneInterface extends MaticoPaneInterface{
  controls : Array<any>,
  title?: string
}

export const MaticoControlsPane :React.FC<MaticoControlPaneInterface> = ({
  controls,
  title
})=>{
    console.log("Controls ", controls )
    return <Box pad={'small'} gap={'medium'} style={{textAlign:'left', width:'100%', height:'100%'}}>
      <h2>{title}</h2>
      {controls.map(controlSpec=>{
        const [type, params ] = Object.entries(controlSpec)[0]
        switch(type){
          case 'Range':
            //@ts-ignore
            return <Box direction='row' gap={"medium"} alignContent={'between'}><Text>{params.name}</Text> <MaticoRangeControl {...params} /></Box>
          case "Select":
            //@ts-ignore
            return <Box direction="row" gap={"medium"} alignContent={'between'}><Text>{params.name}</Text><MaticoSelectControl {...params} /></Box>
        }
      })}
    </Box>

}
