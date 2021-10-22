import React, {useReducer, createContext, useEffect} from 'react'
import {Dataset} from '../../Datasets/Dataset'
import {GeoJSONDataset} from '../../Datasets/GeoJSONDataset'

export enum MaticoDataActionType{
  REGISTER_DATASET
}

type RegisterDataset={
  type: MaticoDataActionType.REGISTER_DATASET,
  payload: Dataset 
}

export type MaticoDataAction = RegisterDataset 

export interface MaticoDataState{
  datasets: Array<Dataset>
}

const InitalState : MaticoDataState= {
  datasets:[],
}


export const MaticoDataContext = createContext<{
    state:  MaticoDataState;
    dispatch: React.Dispatch<MaticoDataAction>;
    registerDataset: (dataset:Dataset)=>void
}>({
    state: InitalState,
    dispatch: () => null,
    registerDataset: () => null,
});

function reducer(state: MaticoDataState, action: MaticoDataAction): MaticoDataState{
    const {type,payload} = action

    switch(type){
      case MaticoDataActionType.REGISTER_DATASET:
        return {...state, datasets: [...state.datasets, payload]}
      default:
        return state
    }
}


//TODO properly type and handle different dataset types
export const MaticoDataProvider: React.FC<{onStateChange?: (state: MaticoDataState)=>void, datasets: any}> = ({children, onStateChange,datasets})=>{
  const [state,dispatch] = useReducer(reducer,InitalState);

  const registerDataset = (dataset:Dataset)=>{
    if(state.datasets.find(d=>d.name = dataset.name)){
      return 
    }

    dispatch({
      type: MaticoDataActionType.REGISTER_DATASET,
      payload: dataset
    })
  }

  datasets.forEach((dataset)=> {
    if(state.datasets.find(d=>d.name === dataset.GeoJSON.name)){
      return 
    }
    if(dataset.GeoJSON){
      registerDataset(new GeoJSONDataset(dataset.GeoJSON.name, dataset.GeoJSON.url))
    }
  })


  useEffect(()=>{
    if(onStateChange){
      onStateChange(state)
    }
  },[state])
  return (
    <MaticoDataContext.Provider value={{state,dispatch, registerDataset}}>
      {children}
    </MaticoDataContext.Provider>
  )
}
