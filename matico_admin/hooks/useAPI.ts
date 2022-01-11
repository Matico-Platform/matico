import useSWR from 'api'

export const useAPI= (id: string)=>{
  return useSWR(`/api/queries/${id}`, {refreshInterval:1000}) 
}
