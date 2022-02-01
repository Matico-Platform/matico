import {useEffect} from "react";
import {Query, registerDataUpdates} from "Stores/MaticoDatasetSlice";
import {Filter} from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useRequestData = (datasetName: string, filters?: Array<Filter>,includeGeo? : boolean) =>{
  const dispatch = useMaticoDispatch()
  const requestHash = JSON.stringify({datasetName,filters, includeGeo})
  const result : Query | null = useMaticoSelector((state)=>state.datasets.queries[requestHash])

  useEffect(()=>{
    if(!result && datasetName){
      dispatch(registerDataUpdates({datasetName,requestHash,filters, includeGeo}))
    }
  },[requestHash, result])

  return result 
}
