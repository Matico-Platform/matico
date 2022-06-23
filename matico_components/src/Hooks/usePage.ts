import {Page, Pane} from "@maticoapp/matico_types/spec"
import {useMaticoDispatch, useMaticoSelector} from "./redux"
import {updatePageDetails, removePage } from '../Stores/MaticoSpecSlice'

export const usePage= (pageId:string)=>{
  const page = useMaticoSelector((selector)=> selector.spec.spec.pages.find((p:Page)=> p.id == pageId))

  const dispatch = useMaticoDispatch()

  const updatePage = (update:Partial<Page>)=>{
    dispatch(updatePageDetails({pageId,update}))
  }

  const removePageLocal = ()=>{
    dispatch(removePage({pageId, removeOrphanPanes:false}))
  }

  return {page, updatePage, removePage : removePageLocal}
}
