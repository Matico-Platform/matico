import { useSWRAPI, urlForSource, SourceType, Source } from "../utils/api";

export type Page = {
  limit: number;
  offset: number;
};

export type Sort = {
  column: String;
  direction: "descending" | "ascending";
};

export const useTableData = (
  source: Source,
  filters: Array<any>,
  sort: Sort,
  page: Page
) => {
  let baseUrl = urlForSource(source);

  switch (source?.type) {
    case SourceType.Dataset:
      baseUrl = `${baseUrl}/data`;
      break;
    case SourceType.API:
      baseUrl = `${baseUrl}/run`;
      break;
    default:
      baseUrl = null;
  }

  const { data, error, mutate } = useSWRAPI( source ?  baseUrl: null, {
    params: { ...source?.parameters, ...page, ...sort, include_metadata:true },
    refreshInterval: 0,
  });

  return { data, error: error?.response?.data, mutate };
};
