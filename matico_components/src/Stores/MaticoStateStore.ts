import {configureStore} from "@reduxjs/toolkit"
import {variableReducer} from './MaticoVariableSlice'

export const store = configureStore({
  reducer:{
    variables: variableReducer
  }
})

export type VariableState = ReturnType<typeof store.getState>
export type VariableDispatch = typeof store.dispatch
