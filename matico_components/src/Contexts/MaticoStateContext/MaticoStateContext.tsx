import React, {useReducer, createContext, useEffect} from 'react'
import {MaticoStateVariable} from './VariableTypes'

export enum MaticoStateActionType {
  UPDATE_VARIABLE,
  REGISTER_AUTO_VARIABLE,
  REGISTER_DECLARED_VARIABLE,
  UNREGISTER_AUTO_VARIABLE,
  SET_AUTO_VARIABLE
}

type UpdateVariableAction={
  type: MaticoStateActionType.UPDATE_VARIABLE,
  payload: MaticoStateVariable
}

type SetAutoVariableAction={
  type: MaticoStateActionType.SET_AUTO_VARIABLE,
  payload: MaticoStateVariable
}

type UnregisterAutoVariable={
  type: MaticoStateActionType.UNREGISTER_AUTO_VARIABLE,
  payload: string  
}

type RegisterAutoVariableAction={
  type: MaticoStateActionType.REGISTER_AUTO_VARIABLE,
  payload: MaticoStateVariable,
}

type RegisterDeclaredVariableAction={
  type: MaticoStateActionType.REGISTER_DECLARED_VARIABLE,
  payload: MaticoStateVariable,
}
export type MaticoStateAction = SetAutoVariableAction | UpdateVariableAction | RegisterAutoVariableAction | RegisterDeclaredVariableAction | UnregisterAutoVariable

export interface MaticoVariableState{
  autoVariables : Array<MaticoStateVariable>,
  declaredVariables: Array<MaticoStateVariable>
}

const InitalState : MaticoVariableState= {
  autoVariables:[],
  declaredVariables:[]
}


export const MaticoStateContext = createContext<{
    state:  MaticoVariableState;
    dispatch: React.Dispatch<MaticoStateAction>;
}>({
    state: InitalState,
    dispatch: () => null,
});

function reducer(state: MaticoVariableState, action: MaticoStateAction): MaticoVariableState{
    const {type} = action

    switch(type){
      case MaticoStateActionType.SET_AUTO_VARIABLE:
        if (state.autoVariables.find(v => v.name === action.payload.name)){
          return {...state, autoVariables: state.autoVariables.map(av => av.name === action.payload.name ? action.payload : av)}
        } else {
          return {...state, autoVariables: [...state.autoVariables, action.payload]}
        }
      case MaticoStateActionType.REGISTER_AUTO_VARIABLE:
        return {...state, autoVariables: [...state.autoVariables, action.payload ]}
      case  MaticoStateActionType.REGISTER_DECLARED_VARIABLE :
        return {...state, declaredVariables: [...state.declaredVariables, action.payload] }
      case MaticoStateActionType.UNREGISTER_AUTO_VARIABLE:
        return {...state, autoVariables: state.autoVariables.filter(v => v.name !== action.payload)}
      case  MaticoStateActionType.UPDATE_VARIABLE:
        return {...state, 
          autoVariables: state.autoVariables.map(av => av.name === action.payload.name ? action.payload : av),
          declaredVariables : state.declaredVariables.map(dv=> dv.name===action.payload.name ? action.payload: dv)
         }

      default:
        return state
    }
}

export const MaticoStateProvider: React.FC<{onStateChange?: (state: MaticoVariableState)=>void}> = ({children, onStateChange})=>{
  const [state,dispatch] = useReducer(reducer,InitalState);
  useEffect(()=>{
    if(onStateChange){
      onStateChange(state)
    }
  },[state])
  return (
    <MaticoStateContext.Provider value={{state,dispatch}}>
      {children}
    </MaticoStateContext.Provider>
  )
}
