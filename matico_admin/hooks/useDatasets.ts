import { useSWRAPI, updateDataset } from "../utils/api";

export const useDatasets = () => {
  const { data, error, mutate } = useSWRAPI("/datasets", {
    refreshInterval: 10000,
  });
  return { datasets: data, datasetsError: error, datasetsMutate: mutate };
};

export const useDataset = (id: string) => {
  const { data, error, mutate } = useSWRAPI(`/datasets/${id}`, {
    refreshInterval: 0,
  });

  const attemptUpdateDataset = async (update: any) => {
    mutate({ ...data, ...update });
    await updateDataset(id, update);
    mutate();
  };
  return {
    dataset: data,
    datasetError: error,
    updateDataset: attemptUpdateDataset,
  };
};
