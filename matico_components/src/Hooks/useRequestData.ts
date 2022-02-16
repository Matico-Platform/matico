import {useEffect, useMemo} from "react";
import {Query, registerDataUpdates} from "Stores/MaticoDatasetSlice";
import {Filter} from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
//@ts-ignore
import { v4 as uuid } from 'uuid';

export const useRequestData = (datasetName: string, filters?: Array<Filter>,includeGeo? : boolean) =>{
  const dispatch = useMaticoDispatch()
  const requestHash = JSON.stringify({datasetName,filters, includeGeo})
  const result : Query | null = useMaticoSelector((state)=>state.datasets.queries[requestHash])
  const notifierId = useMemo(() => uuid(),[requestHash, JSON.stringify(filters)])
  
  useEffect(()=>{
    if(!result && datasetName){
      dispatch(registerDataUpdates({datasetName,requestHash,filters, includeGeo, notifierId}))
    }
  },[requestHash, result])

  return result 
}
