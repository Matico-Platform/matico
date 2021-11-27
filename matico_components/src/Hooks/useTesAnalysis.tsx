import {useEffect, useState } from 'react'
import {LocalDataset} from '../Datasets/LocalDataset';

export const useBufferAnalysis=()=>{
    const [analysis,setAnalysis] = useState<any>(null)
    const [ready,setReady] = useState<boolean>(false)

  useEffect(() => {
    let f = async () => {
      try {
        const wasm = await import("matico_buffer_analysis");
        setAnalysis(wasm)
        setReady(true)
      } catch (err) {
        console.log("unexpected error in loading analysis wasm ", err);
      }
    };
    f();
  }, []);
  return [analysis,ready]
}
