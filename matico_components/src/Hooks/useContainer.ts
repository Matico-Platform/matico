import {ContainerPane, PaneRef,Pane} from '@maticoapp/matico_types/spec'
import {useMaticoDispatch, useMaticoSelector} from './redux'
import {removePaneFromContainer, addPaneRefToContainer, addPane, setCurrentEditElement} from "Stores/MaticoSpecSlice"
import {usePane} from './usePane'
import {v4 as uuidv4} from 'uuid'
import { DefaultPosition, PaneDefaults } from 'Components/MaticoEditor/Utils/PaneDetails'

export const useContainer= (paneRef:PaneRef)=>{
  const paneProperties = usePane(paneRef)
  const { pane } = paneProperties;
  const dispatch = useMaticoDispatch()

  const container = paneProperties.pane.type==='container' ? paneProperties.pane as ContainerPane : null

  const subPanes = useMaticoSelector((selector)=> container?.panes.map((paneRef:PaneRef)=> selector.spec.spec.panes.find((pane:Pane)=>pane.id === paneRef.paneId)))

  const removePaneFromContainerLocal =(paneRef:PaneRef)=>{
    dispatch(removePaneFromContainer({containerId:container?.id, paneRefId:paneRef.id}))
  } 

  const selectSubPane = (subPane: PaneRef)=>{
    dispatch(setCurrentEditElement({id: subPane.id, parentId: pane.id, type:"pane"}))
  }

  const addPaneToContainer = (newPane: Pane)=>{
    if(pane.type==='container'){
      dispatch(addPane({
        pane: newPane
      }))
      
      dispatch(addPaneRefToContainer({
        containerId: pane.id,
        paneRef: {
          id: uuidv4(),
          paneId: newPane.id,
          type: newPane.type,
          position: DefaultPosition,
        }
      }))
      }
      else{
        console.warn("tried to add pane to non container pane")
      }
  }

  return { ...paneProperties, container, addPaneToContainer, removePaneFromContainer:removePaneFromContainerLocal, selectSubPane, subPanes}
}
