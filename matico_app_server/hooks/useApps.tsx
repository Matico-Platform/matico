import { App } from "@prisma/client";
import useSwr from "swr";
import { useApi } from "../utils/api";

export interface UseAppsArgs {
  ownerId?: string;
  public?: boolean;
  includeCollaborators?: boolean,
  order?:string,
  orderDir?: "asc"| "desc",
  take?:number,
  skip?:number,
}

export const useApps = (params: UseAppsArgs, initalData?: App[]) => {
  const {
    data: apps,
    error,
    mutate,
  } = useApi("/api/apps", { initalData, params: params });

  const createAppFromFork = async(
    appId: string,
    name?: string,
    description?: string
  )=>{

    return fetch(`/api/apps/`, {
      method: "POST",
      body: JSON.stringify({
        name: name ?? "My New App",
        description: description ?? "A new blank app",
        public: false,
        forkId: appId
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        mutate()
        return r
      });
  }

  const createAppFromTemplate = async (
    template: string,
    name?: string,
    description?: string
  ) => {
    return fetch(`/api/apps/`, {
      method: "POST",
      body: JSON.stringify({
        name: name ?? "My New App",
        description: description ?? "A new blank app",
        public: false,
        template,
      }),
    })
      .then((r) => r.json())
      .then((r) =>{
        console.log(r)
        mutate()
        return r 
      });
  };

  const createAppFromDemo = async (
    spec: App,
    name?: string,
    description?: string
  ) => {
    return fetch(`/api/apps/`, {
      method: "POST",
      body: JSON.stringify({
        name: name ?? "My New App",
        description: description ?? "A new blank app",
        public: false,
        spec: JSON.stringify(spec),
      }),
    })
      .then((r) => r.json())
      .then((r) =>{
        console.log(r)
        mutate()
        return r 
      });
  };

  return { apps, error, mutate, createAppFromTemplate, createAppFromFork, createAppFromDemo};
};
