import useSWR, { Key, Fetcher } from "swr";

export const useDatasetData = (
  id: string,
  page?: number,
  perPage: number = 50
) => {
  const offset = page ? page * perPage : 0;
  return useSWR(
    `http://localhost:8000/api/datasets/${id}/data?limit=${perPage}&offset=${offset}`,
    (url) => fetch(url).then((r) => r.json()),
    { refreshInterval: 10000 }
  );
};
