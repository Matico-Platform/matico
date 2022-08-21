import {App} from "@maticoapp/matico_types/spec"
import {useMaticoSelector} from "./redux"


export const useNormalizedSpecSelector =( selectFunc: (spec:App)=>any )=>{
  const specFragment = useMaticoSelector((selector) =>{
    return selector.spec.normalizedSpec ?  selectFunc(selector.spec.normalizedSpec) : null
  })
  return specFragment
}
