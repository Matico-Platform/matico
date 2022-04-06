import { useSWRAPI, Source, urlForSource, SourceType} from "../utils/api";

export const useColumnStat = (
  source: Source,
  colName: string,
  statDetails: any
) => {
  let url = urlForSource(source,`/columns/${colName}/stats`);

  console.log("Attempting to get stat for ", source, colName, statDetails);

  let params = { stat: JSON.stringify(statDetails), ...source.parameters, q:source.query }
  if(url && source.type===SourceType.Query){
    url = url.split("?")[0]
  }

  return useSWRAPI(source && statDetails && colName ? url : null, {
    params ,
    refreshInterval: 0,
  });
};
