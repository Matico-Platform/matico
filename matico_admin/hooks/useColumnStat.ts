import { useSWRAPI } from "../utils/api";
import { Source, SourceType } from "./useTableData";

const urlForSource = (source: Source) => {
  switch (source?.type) {
    case SourceType.Dataset:
      return `/datasets/${source?.id}/columns`;
    case SourceType.API:
      return `/apis/${source?.id}/columns`;
    default:
      return null;
  }
};

export const useColumnStat = (
  source: Source,
  colName: string,
  statDetails: any
) => {
  let url = urlForSource(source);

  return useSWRAPI(`${url}/${colName}/stats`, {
    params: { stat: JSON.stringify(statDetails) },
    refreshInterval: 0,
  });
};
