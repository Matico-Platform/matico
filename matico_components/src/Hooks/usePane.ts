import {Page, Pane, PanePosition, PaneRef,ContainerPane} from "@maticoapp/matico_types/spec"
import {updatePaneDetails, removePane, updatePanePosition, findParent} from "Stores/MaticoSpecSlice"
import {useMaticoDispatch, useMaticoSelector} from "./redux"

export const usePane = (paneRef:PaneRef)=>{
  const dispatch = useMaticoDispatch()
  const pane = useMaticoSelector((selector)=> selector.spec.spec.panes.find((p:Pane)=> p.id ==paneRef.paneId))
  const parent  = useMaticoSelector((selector)=> findParent(selector.spec.spec, paneRef.id)) as Page | ContainerPane 
  const updatePane = (update:Partial<Pane>)=>{
    dispatch(updatePaneDetails({id:paneRef.paneId,update}))
  }

  const updatePanePositionLocal =(update:Partial<PanePosition>)=>{
    dispatch(updatePanePosition({paneRefId:paneRef.id, update}))
  }

  const deletePane= ()=>{
    dispatch(removePane({id:paneRef.paneId}))
  }
  

  return {pane, updatePane, removePane: deletePane, updatePanePosition: updatePanePositionLocal, parent }
}
