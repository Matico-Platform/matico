import {ContainerPane, PaneRef,Pane} from '@maticoapp/matico_types/spec'
import {useMaticoDispatch, useMaticoSelector} from './redux'
import {removePaneFromContainer, addPaneRefToContainer, addPane, setCurrentEditElement} from "Stores/MaticoSpecSlice"
import {usePane} from './usePane'
import {v4 as uuidv4} from 'uuid'

export const useContainer= (paneRef:PaneRef)=>{
  const paneProperties = usePane(paneRef)
  const dispatch = useMaticoDispatch()

  const container = paneProperties.pane.type==='container' ? paneProperties.pane as ContainerPane : null

  const subPanes = useMaticoSelector((selector)=> container?.panes.map((paneRef:PaneRef)=> selector.spec.spec.panes.find((pane:Pane)=>pane.id === paneRef.paneId)))

  const removePaneFromContainerLocal =(paneRef:PaneRef)=>{
    dispatch(removePaneFromContainer({containerId:container?.id, paneRefId:paneRef.id}))
  } 

  const selectSubPane =(paneRef: PaneRef)=>{
    dispatch(setCurrentEditElement({id: paneRef.id, type:"pane"}))
  }

  const addPaneToContainer = (pane: Pane)=>{
    if(pane.type==='container'){
      dispatch(addPane({
        pane
      }))

      dispatch(addPaneRefToContainer({
        containerId: pane.id,
        paneRef: {
          id: uuidv4(),
          paneId: pane.id,
          type: pane.type,
          position: {
            width:10,
            height:10,
            x:10,
            y:10,
            xUnits:"percent",
            yUnits:"percent",
            widthUnits:"percent",
            heightUnits:"percent",
            layer:10,
            padTop:0,
            padLeft:0,
            padRight:0,
            padBottom:0,
            padUnitsTop:"pixels",
            padUnitsLeft:"pixels",
            padUnitsRight:"pixels",
            padUnitsBottom:"pixels",
            float:false
          }
        }
      }))
      }
      else{
        console.warn("tried to add pane to non container pane")
      }
  }

  return { ...paneProperties, container, addPaneToContainer, removePaneFromContainer:removePaneFromContainerLocal, selectSubPane, subPanes}
}
