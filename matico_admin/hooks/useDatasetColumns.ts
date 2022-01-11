import {useSWRAPI} from '../utils/api'

export const useDatasetColumns= (id:string)=>{
  return useSWRAPI(`/datasets/${id}/columns`, {refreshInterval:1000}) 
}
