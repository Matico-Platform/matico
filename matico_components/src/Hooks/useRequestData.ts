import {useEffect, useMemo} from "react";
import {Query, registerDataUpdates} from "Stores/MaticoDatasetSlice";
import {Filter} from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
//@ts-ignore
import { v4 as uuid } from 'uuid';

export const useRequestData = (datasetName: string, filters?: Array<Filter>, columns?: Array<string>, limit?: number) =>{
  const dispatch = useMaticoDispatch()
  const requestHash = JSON.stringify({datasetName,filters,columns, limit })
  const result : Query | null = useMaticoSelector((state)=>state.datasets.queries[requestHash])

  const notifierId = useMemo(() => uuid(),[])
  
  useEffect(()=>{
    if(!result && datasetName){
      dispatch(registerDataUpdates({datasetName,requestHash,filters, columns, limit,  notifierId}))
    }
  },[requestHash, result])

  return result 
}
