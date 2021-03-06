import {useSWRConfig} from "swr";
import { useSWRAPI, createApi, updateApi } from "../utils/api";

export const useApis = () => {
  const { data, error, mutate } = useSWRAPI(`/apis`, {
    refreshInterval: 1000,
  });

  const attemptCreateApi = async (api: any) => {
    mutate([...data, api], false);
    await createApi(api);
    mutate();
  };
  return { apis: data, error, createApi: attemptCreateApi };
};

export const useApi = (apiID: string, opts: any) => {
  const { data, error, mutate } = useSWRAPI(`/apis/${apiID}`, opts);
  const {mutate: allMutate} = useSWRConfig()

  const attemptUpdateApp = async (api: any) => {
    mutate({ ...data, ...api });
    await updateApi(apiID, api);
    mutate();
  };
  return { api: data, error, updateApi: attemptUpdateApp };
};

export const useApiTableData = (api: any, params: { [param: string]: any }) => {
  const { data, error, mutate } = useSWRAPI(api ? `/apis/${api.id}/run` : null, params);
  return { data, error: error?.response?.data, mutate };
};
