import {Page, Pane} from "@maticoapp/matico_types/spec";
import {useMaticoSelector} from "./redux"

export const useSpecElement = (targetId:string)=>{
  const {panes,pages}= useMaticoSelector((slice)=>slice.spec.spec)
  let element;
  if ( element = panes.find((p:Pane)=>p.id === targetId) ){
    return [element,"pane"]
  }
  if (element = pages.find((p:Page)=>p.id === targetId)){
    return [element, 'page']
  }
}
