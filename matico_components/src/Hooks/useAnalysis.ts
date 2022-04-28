import {useState} from "react";

export const loadAnalysis = async (url:string)=>{
  const wasm = await import(/* webpackIgnore: true */   url)
  await wasm.default();
  let key = Object.keys(wasm).find(k => k.includes("Interface"))
  return wasm[key].new()
}

export const useAnalysis = (url:string)=>{
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string|null>(null)
  
  const load = ()=>{
    loadAnalysis(url).then((module)=>{
      setAnalysis(module)
      setError(null)
    })
    .catch((e)=>{
      setAnalysis(null)
      setError(e.to_string())
    })
  }

  return {analysis,error, load}
}
