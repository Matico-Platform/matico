import { useEffect, useState } from "react";
import {ParameterOptions, ParameterValue, SpecParameter} from "@maticoapp/matico_types/spec"

const analysisCache: Record<string, any> = {};

export const loadAnalysis = async (url: string) => {
    console.log("starting import ", url)
    const wasm = await import(/* webpackIgnore: true */url);
    console.log("Wasm import is ", wasm)
    await wasm.default();
    console.log("wasm is inialized " )
    let key = Object.keys(wasm).find((k) => k.includes("Interface"));
    console.log("key is ", key)
    return wasm[key].new();
};


export const populateDefaults = (options: Record<string,ParameterOptions>)=>{
  let defaults: Array<SpecParameter> = [] 
  Object.entries(options).map(([key,option])=>{
    if (option.type === "optionGroup"){
      let value = populateDefaults(option.options)
      defaults.push ({name:key, parameter:{type:option.type, value: value}})
    } 
    else if (option.type === "repeatedOption"){
      let values = []
      for(let i = 0; i< option.min_times; i++){
        values.push({type:option.type, value: populateDefaults({ [key] : option.options})}) 
      } 
      defaults.push({name: key, parameter:{type: option.type, value: values}})
    }
    else{
      defaults.push({name:key, parameter:{type:option.type, value: option.default}})
    }
  }) 
  return defaults
}

export const useAnalysis = (url: string | null) => {
    const [analysis, setAnalysis] = useState<any>(null);
    const [defaults, setDefaults] = useState<any>(null);
    const [options, setOptions] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If we have already loaded the analysis node
        // simply return it.

        if (url in analysisCache) {
            setAnalysis(analysisCache[url]);
            return;
        }

        // Or fetch it and cache it
        if (url) {
            console.log("loading from url ", url)
            loadAnalysis(url)
                .then((module) => {
                    setAnalysis(module);
                    analysisCache[url] = module;
                    let options = module.options();
                    setOptions(options)
                    let defaults = populateDefaults(options)               
                    setDefaults(defaults)
                    setError(null);
                })
                .catch((e) => {
                    debugger
                    setAnalysis(null);
                    setError(e.to_string());
                });
        }
    }, [url]);

    return { analysis, error, defaults,options};
};
