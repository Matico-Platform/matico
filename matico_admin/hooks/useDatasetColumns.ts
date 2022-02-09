import {useSWRAPI,Source,urlForSource} from '../utils/api'


export const useDatasetColumns= (source: Source)=>{
  let url = urlForSource(source)
  return useSWRAPI(`${url}/columns`, {refreshInterval:0, params:source.parameters}) 
}

export const useDatasetColumn= (source:Source, colName:string | undefined | null)=>{
  let url = urlForSource(source)
  const {data,error, mutate} = useSWRAPI(`${url}/columns/${colName}`, {refreshInterval:0, params:source.parameters}) 
  return {column : data, columnError: error, mutateCol: mutate }
}
