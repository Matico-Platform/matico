import {useSWRAPI} from "../utils/api";

export const useDatasets= ()=>{
  return useSWRAPI('/datasets',  {refreshInterval:10000}) 
}

export const useDataset= (id:string)=>{
  return useSWRAPI(`/datasets/${id}`, {refreshInterval:1000}) 
}
