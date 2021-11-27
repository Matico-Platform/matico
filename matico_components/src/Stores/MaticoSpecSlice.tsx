import {createSlice, PayloadAction } from "@reduxjs/toolkit"
import {Dashboard,Page} from 'matico_spec'
import _ from "lodash"

export interface SpecState{
  spec: Dashboard | undefined
  editing: boolean
}

const initialState : SpecState={
  spec : undefined,
  editing:false
}

export const stateSlice = createSlice({
  name: "variables",
  initialState,
  reducers:{
    setEditing: (state,action: PayloadAction<boolean>)=>{
        state.editing = action.payload
    },
    setSpec: (state,action: PayloadAction<Dashboard>)=>{
        state.spec = action.payload
    },
    specUpdateAtPath: (state,action: PayloadAction<{path: string, update:any}>)=>{
        state
    },
    addPage: (state,action: PayloadAction<{page:Page}>)=>{
        state.spec.pages.push(action.payload.page)
    },
    removePage: (state,action: PayloadAction<{pageName:string}>)=>{
      const newPages = state.spec.pages.filter(p=>p.name !== action.payload.pageName)
      state.spec.pages = newPages
    }
  }
})

export const {setEditing, setSpec, addPage, removePage} = stateSlice.actions

export const selectSpec= (state: SpecState)=>state.spec

export const specReducer = stateSlice.reducer
