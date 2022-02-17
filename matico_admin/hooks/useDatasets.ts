import {useSWRAPI, updateDataset} from "../utils/api";

export const useDatasets= ()=>{
  return useSWRAPI('/datasets',  {refreshInterval:10000}) 
}

export const useDataset= (id:string)=>{

  const {data,error,mutate} = useSWRAPI(`/datasets/${id}`, {refreshInterval:1000}) 
    
  const attemptUpdateDataset= async (update: any) => {
    mutate({ ...data, ...update});
    await updateDataset(id, update);
    mutate();
  };
  return { dataset: data, datasetError:error, updateDataset: attemptUpdateDataset};
}
