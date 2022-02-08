import {useSWRAPI} from '../utils/api'
import {Source, SourceType} from './useTableData'

const urlForSource = (source:Source)=>{
  switch (source?.type) {
    case SourceType.Dataset:
      return  `/datasets/${source?.id}/columns`;
    case SourceType.API:
      return `/apis/${source?.id}/columns`;
    default:
      return null;
  }
}

export const useDatasetColumns= (source: Source)=>{
  let url = urlForSource(source)
  return useSWRAPI(url, {refreshInterval:0, params:source.parameters}) 
}

export const useDatasetColumn= (source:Source, colName:string)=>{
  let url = urlForSource(source)
  return useSWRAPI(`${url}/${colName}`, {refreshInterval:0, params:source.parameters}) 
}
