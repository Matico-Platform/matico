import {configureStore} from "@reduxjs/toolkit"
import {specReducer} from "./MaticoSpecSlice"
import {variableReducer} from './MaticoVariableSlice'

export const store = configureStore({
  reducer:{
    variables: variableReducer,
    spec: specReducer
  }
})

export type MaticoState = ReturnType<typeof store.getState>
export type MaticoDispatch = typeof store.dispatch

