import {useMemo, useContext} from 'react'
import traverse from 'traverse'
import {useVariableSelector} from './redux'
import _ from 'lodash'

export const useSubVariables = (struct:any)=>{
  const state = useVariableSelector((state)=>state.variables.autoVariables) 
  const datasets = useVariableSelector((state)=>state.variables.autoVariables) 

   return useMemo( ()=>  traverse(struct).map(function(node){
    if(node && node.var){
      const variableName = node.var.split(".")[0]
      const path = node.var.split(".").slice(1).join(".")
      const variable = state[variableName]
      if(variable=== null || variable===undefined){
        console.warn("failed to find variable", variableName)
        return 
      }
      const value  = _.at(variable.value,path)[0]
      this.update(value)
    }
  }),[JSON.stringify(struct), JSON.stringify(state)])

}
