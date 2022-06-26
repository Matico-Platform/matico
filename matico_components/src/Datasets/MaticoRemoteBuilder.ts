import {MaticoRemoteDataset} from "./MaticoRemoteDataset";
import {MaticoRemoteDataset as MaticoRemoteDatasetSpec} from "@maticoapp/matico_types/spec"


export const MaticoRemoteBuilder = async (details: MaticoRemoteDatasetSpec) => {
  const { name, serverUrl, datasetId } = details;

  return new MaticoRemoteDataset(
    name,
    datasetId,
    serverUrl,
  );
};

