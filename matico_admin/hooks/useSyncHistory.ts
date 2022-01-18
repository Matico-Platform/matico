import {useSWRAPI} from "../utils/api";

export const useSyncHistory= (id:string)=>{
  return useSWRAPI(`/datasets/${id}/sync_history`,  {refreshInterval:4000}) 
}
