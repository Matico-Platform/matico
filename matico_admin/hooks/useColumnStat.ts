import { useSWRAPI, Source, urlForSource, SourceType} from "../utils/api";

export const useColumnStat = (
  source: Source | null | undefined,
  colName: string,
  statDetails: any
) => {
  let url = source ? urlForSource(source,`/columns/${colName}/stats`): null;

  let params = source ? { stat: JSON.stringify(statDetails), ...source.parameters, q:source.query } : null
  if(url && source?.type===SourceType.Query){
    url = url.split("?")[0]
  }

  return useSWRAPI(source && statDetails && colName ? url : null, {
    params ,
    refreshInterval: 0,
  });
};
