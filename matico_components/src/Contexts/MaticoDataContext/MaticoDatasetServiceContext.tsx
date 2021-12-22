import React, {createContext} from 'react'
// @ts-ignore
import DatasetServiceWorker from 'Datasets/DatasetServiceWorker.worker.ts'
import {DatasetServiceInterface} from 'Datasets/DatasetService';
import {wrap} from 'comlink';
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";


export const MaticoDatasetServiceContext= createContext(null)

export const MaticoDatasetServiceProvider: React.FC = ({children})=>{
  let worker;

  if(!worker){
    worker = wrap<DatasetServiceInterface>(DatasetServiceWorker())
  }


  const RegisterDataset = (name:string, datasetMeta:Dataset){

  }
  
  return(
    <MaticoDatasetServiceContext.Provider value={worker}>
      {children}
    </MaticoDatasetServiceContext.Provider>
  )
} 
