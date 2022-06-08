import {useEffect, useState} from "react";

const analysisCache : Record<string,any> = {}

export const loadAnalysis = async (url:string)=>{
  const wasm = await import(/* webpackIgnore: true */   url)
  await wasm.default();
  let key = Object.keys(wasm).find(k => k.includes("Interface"))
  return wasm[key].new()
}

export const useAnalysis = (url:string | null)=>{
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string|null>(null)
  
  useEffect(()=>{
    // If we have already loaded the analysis node 
    // simply return it.

    if(url in analysisCache){
      setAnalysis(analysisCache[url])
      return
    }

    // Or fetch it and cache it 
    if(url){
      loadAnalysis(url).then((module)=>{
        setAnalysis(module)
        analysisCache[url] = module
        setError(null)
      })
      .catch((e)=>{
        console.log("Error is ", e)
        setAnalysis(null)
        setError(e.to_string())
      })
    }
  },[url])

  
  return {analysis,error}
}
