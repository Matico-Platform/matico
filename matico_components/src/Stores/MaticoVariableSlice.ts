import {createSlice, PayloadAction } from "@reduxjs/toolkit"
import {MaticoStateVariable} from "./VariableTypes";

export interface VariableState{
  autoVariables: {[name:string] : MaticoStateVariable},
  variables: Array<MaticoStateVariable>
}

const initialState : VariableState={
  autoVariables: {},
  variables: []
}

export const variableSlice = createSlice({
  name: "variables",
  initialState,
  reducers:{
    setAutoVariable: (state,action: PayloadAction<MaticoStateVariable>)=>{
        state.autoVariables[action.payload.name] = action.payload
    },
    unregisterAutoVariable: (state,action: PayloadAction<string>)=>{
      delete state.autoVariables[action.payload]
    }
  }
})

export const {setAutoVariable, unregisterAutoVariable} = variableSlice.actions

export const selectAutoVariables= (state: VariableState)=>state.autoVariables

export const variableReducer = variableSlice.reducer
