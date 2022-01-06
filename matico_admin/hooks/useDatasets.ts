import useSWR, {Key,Fetcher} from 'swr'

export const useDatasets= ()=>{
  return useSWR('http://localhost:8000/api/datasets', (url)=>fetch(url).then(r=>r.json()), {refreshInterval:10000}) 
}
