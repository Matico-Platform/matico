import {useSWRAPI,Source,urlForSource} from '../utils/api'


export const useDatasetColumns= (source: Source | null)=>{
  let url = urlForSource(source)
  const {data, error, mutate} = useSWRAPI(source  ? `${url}/columns` : null, {refreshInterval:0, params:source.parameters}) 
  return {columns:data, columnsError: error, columnsMutate:mutate}
}

export const useDatasetColumn= (source:Source, colName:string | undefined | null)=>{
  let url = urlForSource(source)
  const {data,error, mutate} = useSWRAPI(source && colName ? `${url}/columns/${colName}` : null, {refreshInterval:0, params:source.parameters}) 
  return {column : data, columnError: error, mutateCol: mutate }
}
