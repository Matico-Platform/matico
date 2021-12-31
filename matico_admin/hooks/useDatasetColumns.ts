import useSWR, {Key,Fetcher} from 'swr'

export const useDatasetColumns= (id:string)=>{
  return useSWR(`http://localhost:8000/api/datasets/${id}/columns`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 
}
