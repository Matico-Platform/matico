import {Layout, Page, Pane} from "@maticoapp/matico_types/spec"
import {useMaticoDispatch, useMaticoSelector} from "./redux"
import {updatePageDetails, removePage, addPage, setCurrentEditElement } from '../Stores/MaticoSpecSlice'
import { v4 as uuidv4 } from 'uuid';


export const useApp= ()=>{
  const {metadata,pages,panes}  = useMaticoSelector((selector)=> selector.spec.spec)
  const dispatch = useMaticoDispatch()

  const addPageLocal = (pageName:string, layout: Layout)=>{
    dispatch(addPage(
      {page:{
        name: pageName,
        id: uuidv4(),
        layout,
        panes:[],
        icon: "faHome",
        path: `/page_${pages.length}`
      }
      }
    )) 
  }

  const setEditPage = (id:string)=>{
    dispatch(setCurrentEditElement({
      type:'page',
      id
    }))
  }

  const removePageLocal = (id:string)=>{
    dispatch(removePage({id, removeOrphanPanes:false}))
  }


  return {pages,panes, removePage : removePageLocal, addPage:addPageLocal, setEditPage}
}
