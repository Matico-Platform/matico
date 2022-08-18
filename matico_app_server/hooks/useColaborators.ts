import { Colaborator, User } from "@prisma/client";
import {useSWRConfig} from "swr";
import { useApi } from "../utils/api";

export const useColaborators = (appId: string | undefined) => {
  const {mutate: mutateGlobal} = useSWRConfig()
  const { data, error, mutate } = useApi(
    appId ? `/api/apps/${appId}/colaborators` : null,
    {}
  );


  const addOrUpdateColaborator = (userId:string , permisions?: {view:boolean, edit:boolean, manage:boolean}) => {
    fetch(`/api/apps/${appId}/colaborators`, {
      method: "PUT",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        appId: appId,
        permisions: permisions ??  { view: true, edit: false, manage: false },
      }),
    })
    .then(r=>r.json())
      .then((res) => {
        mutateGlobal(`/apps/${appId}`); 
        mutate(data.map( (c:Colaborator)=>c.id===res.id ? {...c, view: res.view, edit: res.edit, manage:res.manage}: c))
      });
  };

  const removeColaborator = (colaboratorId: string) => {
    fetch(`/api/apps/${appId}/colaborators/${colaboratorId}`, {
      method: "DELETE",
      headers: {
        contentType: "application/json",
      },
    })
      .then(() => {
        mutateGlobal(`/apps/${appId}`);
        mutate();
      });
  };

  return {
    colaborators: data,
    error,
    mutate,
    addOrUpdateColaborator,
    removeColaborator,
  };
};
