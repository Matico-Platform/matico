import {MaticoRemoteDataset} from "./MaticoRemoteDataset";

interface MaticoRemoteBuilderOptions {
  name: string;
  server_url: string;
  dataset_id: string;
  description: string;
}

export const MaticoRemoteBuilder = async (details: MaticoRemoteBuilderOptions) => {
  const { name, server_url, dataset_id } = details;
  console.log("NAME IS ",name, details)

  return new MaticoRemoteDataset(
    name,
    dataset_id,
    server_url,
  );
};

