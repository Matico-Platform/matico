import { Collaborator, User } from "@prisma/client";
import {useSWRConfig} from "swr";
import { useApi } from "../utils/api";

export const useCollaborators = (appId: string | undefined) => {
  const {mutate: mutateGlobal} = useSWRConfig()
  const { data, error, mutate } = useApi(
    appId ? `/api/apps/${appId}/collaborators` : null,
    {}
  );


  const addOrUpdateCollaborator = (userId:string , permisions?: {view:boolean, edit:boolean, manage:boolean}) => {
    fetch(`/api/apps/${appId}/collaborators`, {
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
        mutate(data.map( (c:Collaborator)=>c.id===res.id ? {...c, view: res.view, edit: res.edit, manage:res.manage}: c))
      });
  };

  const removeCollaborator = (collaboratorId: string) => {
    fetch(`/api/apps/${appId}/collaborators/${collaboratorId}`, {
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
    collaborators: data,
    error,
    mutate,
    addOrUpdateCollaborator,
    removeCollaborator,
  };
};
