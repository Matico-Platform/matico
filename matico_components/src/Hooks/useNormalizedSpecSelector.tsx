import {App} from "@maticoapp/matico_types/spec"
import {useMaticoSelector} from "./redux"


export const useNormalizedSpecSelector =( selectFunc: (spec:App)=>any )=>{
  const specFragment = useMaticoSelector((selector) =>{
    return selectFunc(selector.spec.normalizedSpec)
  })
  return specFragment
}
