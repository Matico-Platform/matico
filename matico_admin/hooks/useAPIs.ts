import {useSWRAPI} from '../utils/api'

export const useAPIs= ()=>{
  return useSWRAPI(`/queries`,{refreshInterval:1000}) 
}
