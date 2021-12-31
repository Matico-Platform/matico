import useSWR, {Key,Fetcher} from 'swr'

export const useApps= ()=>{
  return useSWR(`http://localhost:8000/api/dashboards`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 
}
