import useSWR, {Key,Fetcher} from 'swr'

export const useAPI= (id: string)=>{
  return useSWR(`http://localhost:8000/api/queries/${id}`, (url)=>fetch(url).then(r=>r.json()), {refreshInterval:1000}) 
}
