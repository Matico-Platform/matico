import { useEffect, useState } from 'react'

export const useValidator = () => {
  const [validator, setValidator] = useState<any>(null)
  const [validatorReady, setValidatorReady] = useState<boolean>(false)
  const [error, setError] = useState<any | undefined>(undefined)

  useEffect(() => {
    let f = async () => {
      try {
        const wasm = await import( /*webpackChunkName:"spec"*/ '@maticoapp/matico_spec');
        setValidator(wasm)
        setValidatorReady(true)
      } catch (err) {
        setError(`failed to load wasm: ${err}`)
        console.log("unexpected error in load wasm ", err);
      }
    };
    f();
  }, []);
  return { validator, validatorReady, error }
}
