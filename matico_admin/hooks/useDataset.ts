import {useSWRAPI} from '../utils/api'

export const useDataset= (id:string)=>{
  return useSWRAPI(`/datasets/${id}`, {refreshInterval:1000}) 
}
