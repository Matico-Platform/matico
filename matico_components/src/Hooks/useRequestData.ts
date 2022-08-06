import { useEffect, useMemo, useState } from "react";
import { Query, registerDataUpdates } from "Stores/MaticoDatasetSlice";
import { Filter } from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
//@ts-ignore
import { v4 as uuid } from "uuid";

export interface DataRequest {

    datasetName: string,
    filters?: Array<Filter>,
    columns?: Array<string>,
    limit?: number,
    requestHash?:string,
    notifierId?: string
}

export const useRequestDataMulti= (requests: Array<DataRequest>)=>{
    const dispatch = useMaticoDispatch();
    const notifierId = useMemo(() => uuid(), []);
    const requestObjs = requests.map((r)=> ({...r, requestHash: JSON.stringify(r),notifierId}))
    const result = useMaticoSelector((state)=> requestObjs.map(ro => state.datasets.queries[ro.requestHash])).filter(r=>r)

    useEffect(()=>{
      if(result.length===0 && requestObjs){
        requestObjs.forEach((request)=>{
          dispatch(
          registerDataUpdates(request)
          )
        })
      }
    },[requestObjs,result])
    return result 
}

export const useRequestData = (request:DataRequest) => {
    const dispatch = useMaticoDispatch();
    const requestHash = JSON.stringify(request);
    const notifierId = useMemo(() => uuid(), []);

    const result: Query | null = useMaticoSelector(
        (state) => state.datasets.queries[requestHash]
    );


    useEffect(() => {
        if (!result && request) {
            dispatch(
                registerDataUpdates({
                    ...request,
                    requestHash,
                    notifierId
                })
            );
        }
    }, [requestHash, result]);

    return result;
};
