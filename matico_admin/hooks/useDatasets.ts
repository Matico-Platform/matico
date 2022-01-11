import {useSWRAPI} from "../utils/api";

export const useDatasets= ()=>{
  return useSWRAPI('/datasets',  {refreshInterval:10000}) 
}
