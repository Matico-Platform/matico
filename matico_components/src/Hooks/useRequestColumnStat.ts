import {useEffect} from "react";
import {ColumnStatRequest, Query, registerColumnStatUpdates} from "Stores/MaticoDatasetSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

/** 
 * Get a single column stat for a given dataset
 * @param args: ColumnStatRequest : the request we want to get
 *
*/
export const useRequestColumnStat= (args: ColumnStatRequest) =>{
  const dispatch = useMaticoDispatch()
  const requestHash = JSON.stringify(args)
  const result : Query | null = useMaticoSelector((state)=>state.datasets.queries[requestHash])

  useEffect(()=>{
    if(!result && args){
      dispatch(registerColumnStatUpdates({requestHash,args}))
    }
  },[requestHash, result])

  return result 
}

/** 
 * Get mulitple column stats 
 * @param requests: Array<ColumnStatRequest> : the requests we want to get
 *
*/
export const useRequestColumnStats = (requests: Array<ColumnStatRequest>)=>{
  console.log("requsting updates ", requests)
  const dispatch = useMaticoDispatch()
  const requestHashes = requests.map((args) =>JSON.stringify(args))

  const queries = useMaticoSelector((state)=>state.datasets.queries)
  const result = requestHashes.map((rh)=> queries[rh])

  const haveAll = result.every(r=>r)

  useEffect(()=>{
    if(!haveAll && requests){
      requests.forEach((request, index)=>{
        dispatch(registerColumnStatUpdates({requestHash: requestHashes[index],args:request}))
      })
    }
  },[requests, haveAll])

  return result 
}
