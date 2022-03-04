import { useState, useEffect } from "react";
import { PortalInfo } from "./usePortals";

type progressFunc = (frac:number)=>void;

const loadPageOfDatasets = async (portal:string, page:number, perPage:number)=>{
   const url = `https://api.us.socrata.com/api/catalog/v1?domains=${
      portal
    }&search_context=${portal}&limit=${perPage}&offset=${perPage * page}`;
    const resp = await fetch(url);
    const {results} = await resp.json()
    return results
}

const loadDataasets = async (portal : PortalInfo, onProgress? : progressFunc )=>{
  const perPage = 100
  const datasets: Array<any> =[]
  const pages = Math.ceil(portal.count / perPage)
  console.log("loading datasets, it will take ", pages, perPage)
  for( let page =0;  page < pages; page++){
    let pagedDatasets = await loadPageOfDatasets(portal.domain, page, perPage) 
    if(onProgress){
      onProgress(page*100/pages)
    }
    datasets.push(...pagedDatasets)
  }
  return datasets
}

const cache = {}

export const usePortalDatasets= (portal: PortalInfo | null) => {
  const [datasets, setDatasets] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    if(portal){
      if(portal.domain in cache){
        setDatasets(cache[portal.domain])
      }
      else{
        (async()=>{
          setLoading(true);
          let datasets = await loadDataasets(portal,setProgress)
          console.log("datasets ", datasets)
          setDatasets(datasets)
          setLoading(false)
          cache[portal.domain] = datasets
        })()
      }
    }
  },[portal, setLoading]);

  return {datasets,loading, progress};
};
