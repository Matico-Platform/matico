import React from "react"
import {Box} from 'grommet'
import {MaticoPaneInterface} from "../Pane"
import {MaticoControl} from '../../Controls'


interface MaticoControlPaneInterface extends MaticoPaneInterface{
  controls : Array<MaticoControl>,
  title?: string
}

export const MaticoControlsPane :React.FC<MaticoControlPaneInterface> = ({
  controls,
  title
})=>{

    return <Box>
      <h2>Controls</h2>
    </Box>

}
