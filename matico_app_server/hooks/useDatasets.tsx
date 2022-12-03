import { User } from "@prisma/client";
import { useApi } from "../utils/api";

interface useDatasetsProps {
  ownDatasets?: boolean;
  collaboratorDatasets?: boolean;
  publicDatasets?: boolean;
  search?: string;
  includeOwner?: boolean;
}

export const useDatasets = ({
  ownDatasets,
  collaboratorDatasets,
  publicDatasets,
  includeOwner = false,
  search,
}: useDatasetsProps) => {
  const {
    data: datasets,
    error,
    mutate,
  } = useApi("/api/datasets", {
    params: {
      ownDatasets,
      collaboratorDatasets,
      publicDatasets,
      includeOwner,
      search,
    },
  });

  return { datasets, error, mutate };
};
