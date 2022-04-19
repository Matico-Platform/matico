import {useMemo} from "react";
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
  let baseUrl = useMemo(()=> {
    console.log("re memoing baseUrl");
    return urlForSource(source)
  }, [source]);

  const params = useMemo(()=>{
    console.log("re memoing params ", page,sort)
    return {
     ...source?.parameters, ...page, ...sort, include_metadata:true, format:'json' 
  }},[ source,sort, page ])

  const { data, error, mutate } = useSWRAPI( source ?  baseUrl : null, {
    params ,
    refreshInterval: 0,
  });

  return { data, error: error?.response?.data, mutate };
};
