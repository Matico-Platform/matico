import {MaticoRemoteApi} from "./MaticoRemoteApi";

interface MaticoRemoteApiBuilderOptions {
  name: string;
  server_url: string;
  api_id: string;
  description: string;
  params: {[param:string]:any};
}

export const MaticoRemoteApiBuilder = async (details: MaticoRemoteApiBuilderOptions) => {
  const { name, server_url, api_id,params } = details;

  return new MaticoRemoteApi(
    name,
    api_id,
    server_url,
    params
  );
};

