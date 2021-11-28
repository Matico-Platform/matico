import {useEffect, useState } from 'react'

export const useValidator=()=>{
    const [validator,setValidator] = useState<any>(null)
    const [validatorReady,setValidatorReady] = useState<boolean>(false)

  useEffect(() => {
    let f = async () => {
      try {
        const wasm = await import('matico_spec');
        setValidator(wasm)
        setValidatorReady(true)
      } catch (err) {
        console.log("unexpected error in load wasm ", err);
      }
    };
    f();
  }, []);
  return {validator, validatorReady}
}
