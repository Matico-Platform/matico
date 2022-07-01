import {MaticoRemoteApi} from "./MaticoRemoteApi";
import {MaticoApiDataset} from '@maticoapp/matico_types/spec'

export const MaticoRemoteApiBuilder = async (details: MaticoApiDataset) => {
  const { name, serverUrl, apiId,params } = details;

  return new MaticoRemoteApi(
    name,
    apiId,
    serverUrl,
    params
  );
};

