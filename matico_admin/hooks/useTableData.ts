import { useSWRAPI } from "../utils/api";

export enum SourceType {
  API = "api",
  Dataset = "dataset",
}

export type Page = {
  limit: number;
  offset: number;
};

export type Source = {
  id: string;
  type: SourceType;
  parameters?: { [param: string]: any };
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
  let baseUrl;

  switch (source?.type) {
    case SourceType.Dataset:
      baseUrl = `/datasets/${source?.id}/data`;
      break;
    case SourceType.API:
      baseUrl = `/apis/${source?.id}/run`;
      break;
    default:
      baseUrl = null;
  }

  console.log("table data hook ", baseUrl, source);
  const { data, error, mutate } = useSWRAPI(baseUrl, {
    params: { ...source?.parameters, ...page, ...sort },
    refreshInterval: 0,
  });
  console.log("table data hook result ", data, error);
  return { data, error: error?.response?.data, mutate };
};
