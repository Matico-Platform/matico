import {Page, Pane} from "@maticoapp/matico_types/spec"
import {useMaticoDispatch, useMaticoSelector} from "./redux"
import {updatePageDetails, removePage } from '../Stores/MaticoSpecSlice'

export const usePage= (id:string)=>{
  const page = useMaticoSelector((selector)=> selector.spec.spec.page.find((p:Pane)=> p.id ==id))
  const dispatch = useMaticoDispatch()

  const updatePage = (update:Partial<Page>)=>{
    dispatch(updatePageDetails({id,update}))
  }

  const removePageLocal = ()=>{
    dispatch(removePage({id, removeOrphanPanes:false}))
  }
  return {page, updatePage, removePage : removePageLocal}
}
