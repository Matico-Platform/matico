import React from "react"
import {Box} from 'grommet'
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
    return <Box>
      <h2>{title}</h2>
      {controls.map(controlSpec=>{
        const [type, params ] = Object.entries(controlSpec)[0]
        switch(type){
          case 'Range':
            //@ts-ignore
            return <MaticoRangeControl {...params} />
          case "Select":
            //@ts-ignore
            return <MaticoSelectControl {...params} />
        }
      })}
    </Box>

}
