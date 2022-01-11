import {useSWRAPI} from '../utils/api'

export const useAPI= (id: string)=>{
  return useSWRAPI(`/queries/${id}`, {refreshInterval:1000}) 
}
