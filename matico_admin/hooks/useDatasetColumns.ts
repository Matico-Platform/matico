import {useSWRAPI,Source,urlForSource} from '../utils/api'
import {Column} from "@maticoapp/matico_types/api"

export const useDatasetColumns= (source: Source | null)=>{
  let url = urlForSource(source, '/columns')
  const {data, error, mutate} = useSWRAPI(source  ? url : null, {refreshInterval:0, params:source?.parameters}) 
  return {columns:data as Array<Column>, columnsError: error, columnsMutate:mutate}
}

export const useDatasetColumn= (source:Source, colName:string | undefined | null)=>{
  let url = urlForSource(source,`/columns/${colName}`)
  const {data,error, mutate} = useSWRAPI(source && colName ? url : null, {refreshInterval:0, params:source.parameters}) 
  return {column : data as Column, columnError: error, mutateCol: mutate }
}
