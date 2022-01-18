import {
  useSWRAPI,
  createApp as createAppAPI,
  updateApp as updateAppAPI,
} from "../utils/api";

export const useApps = () => {
  const { data, error, mutate } = useSWRAPI(`/apps`, {
    refreshInterval: 1000,
  });
  console.log("data ", data);

  const createApp = async (app: any) => {
    mutate([...data, app], false);
    await createAppAPI(app);
    mutate();
  };
  return { apps: data, error, createApp };
};

export const useApp = (appID: string) => {
  const { data, error } = useSWRAPI(`/apps/${appID}`, {
    refreshInterval: 0,
  });

  const updateApp = async (app: any) => {
    await updateAppAPI(appID, app);
  };
  return { app: data, error, updateApp };
};
