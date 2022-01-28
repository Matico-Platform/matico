import {useEffect} from "react";
import {Query, requestData} from "Stores/MaticoDatasetSlice";
import {Filter} from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

export const useRequestData = (datasetName: string, filters?: Array<Filter>) =>{
  const dispatch = useMaticoDispatch()
  const requestHash = JSON.stringify({datasetName,filters})
  const result : Query | null = useMaticoSelector((state)=>state.datasets.queries[requestHash])

  useEffect(()=>{
    if(!result && datasetName){
      dispatch(requestData({datasetName,requestHash,filters}))
    }
  },[requestHash, result])

  return result 
}
