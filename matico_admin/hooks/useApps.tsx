import useSWR, {useSWRConfig,Key,Fetcher} from 'swr'
import * as api from '../utils/api'

export const useApps= ()=>{
  const {data,error,mutate}= useSWR(`http://localhost:8000/api/apps`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 
  console.log("data ", data)
  
  const createApp= async (app: any)=>{
    console.log("app data is ",data)
    mutate([...data,app],false) 
    await api.createApp(app)
    mutate()
  }
  return {data,error,createApp}
}

export const useApp= (appID:string)=>{
  const {data,error,mutate}= useSWR(`http://localhost:8000/api/apps/${appID}`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 

  const updateApp = async (app:any)=>{
    console.log("Updating app ", app)
    // mutate(app,false)
    await api.updateApp(appID,app)
    mutate()
  }
  return {app:data, error, updateApp}
}
