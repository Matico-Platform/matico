import {App} from "@maticoapp/matico_types/spec"

export const updateApp = async (app:any)=>{
    return fetch(`/api/apps/${app.id}`,{
        method:"PUT",
        body:JSON.stringify(app) 
    })
    .then((r)=>r.json())
  }

