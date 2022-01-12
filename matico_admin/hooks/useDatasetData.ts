import {useSWRAPI} from "../utils/api";

export const useDatasetData = (
  id: string,
  page?: number,
  perPage: number = 50
) => {
  const offset = page ? page * perPage : 0;
  return useSWRAPI(
    `/datasets/${id}/data?limit=${perPage}&offset=${offset}&includeMetadata=true`, 
    { refreshInterval: 10000 }
  );
};
