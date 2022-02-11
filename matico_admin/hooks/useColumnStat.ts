import { useSWRAPI, Source, urlForSource} from "../utils/api";

export const useColumnStat = (
  source: Source,
  colName: string,
  statDetails: any
) => {
  let url = urlForSource(source);

  return useSWRAPI(source && statDetails && colName ? `${url}/columns/${colName}/stats` : null, {
    params: { stat: JSON.stringify(statDetails), ...source.parameters },
    refreshInterval: 0,
  });
};
