import useSWR, {Key,Fetcher} from 'swr'

export const useAPIs= ()=>{
  return useSWR(`http://localhost:8000/api/queries`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 
}
