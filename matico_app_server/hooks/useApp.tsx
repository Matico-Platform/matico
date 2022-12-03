import { App } from "@prisma/client";
import useSWR from "swr";
import { useApi } from "../utils/api";

export const useApp = (appId: string | undefined, initialData?: App) => {
  const { data, error, mutate } = useApi(appId ? `/api/apps/${appId}` : null, {
    initialData,
  });

  const updateApp = async (app: any) => {
    return fetch(`/api/apps/${appId}`, {
      method: "PUT",
      body: JSON.stringify(app),
    })
      .then((r) => r.json())
      .then((r) => {
        mutate(r);
        return r;
      });
  };

  const setPublic = async (isPublic: boolean) => {
    return fetch(`/api/apps/${appId}`, {
      method: "PUT",
      body: JSON.stringify({ id: appId, public: isPublic }),
    })
      .then((r) => r.json())
      .then((r) => mutate(r));
  };

  return { app: data, error, mutate, updateApp, setPublic };
};
