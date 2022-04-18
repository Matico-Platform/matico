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

  console.log("URL is ", source, baseUrl)

  const { data, error, mutate } = useSWRAPI( source ?  baseUrl: null, {
    params: { ...source?.parameters, ...page, ...sort, include_metadata:true, format:'json' },
    refreshInterval: 0,
  });

  return { data, error: error?.response?.data, mutate };
};
