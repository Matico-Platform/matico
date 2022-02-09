import { useSWRAPI, Source, urlForSource} from "../utils/api";

export const useColumnStat = (
  source: Source,
  colName: string,
  statDetails: any
) => {
  let url = urlForSource(source);

  return useSWRAPI(`${url}/columns/${colName}/stats`, {
    params: { stat: JSON.stringify(statDetails) },
    refreshInterval: 0,
  });
};
