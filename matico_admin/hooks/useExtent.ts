import { useSWRAPI, Source, urlForSource } from "../utils/api";


export const useExtent = (source:Source) =>{
  const baseUrl = urlForSource(source);

  const {data, error, mutate} =useSWRAPI( source ? `${baseUrl}/extent` : null , {params: source.parameters})
  return {extent:data, extentError: error, mutateError:mutate}
}
