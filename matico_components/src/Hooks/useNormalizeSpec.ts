import { useState, useEffect, useContext } from "react";
import traverse from "traverse";
import { useMaticoSelector } from "./redux";
import _ from "lodash";
import {ColumnStatRequest} from "Stores/MaticoDatasetSlice";
import {useRequestColumnStats} from "./useRequestColumnStat";

const getRequiredVariableList =(struct: string)=>{
  const requiredVariables: Array<string> = [] 
  traverse(struct).forEach((node:any)=>{
    if(node && node.var){
      requiredVariables.push(node.var.split(".")[0])
    }
  })
  return requiredVariables
}

const getRequiredDatasetMetrics = (struct: any)=>{
  const requiredDataMetrics : Array<ColumnStatRequest> = []
  traverse(struct).forEach((node:any)=>{
    if(node && node.dataset){
      const {dataset,column,feature_id,metric, filters} = node;
      const [metricName, parameters] = Object.entries(metric)[0];
      const requiredMetric = {
        datasetName: dataset,
        column ,
        metric: metricName,
        parameters ,
        filters  
      }
      requiredDataMetrics.push(requiredMetric)
    }
  })
  return requiredDataMetrics
}
/**
 * Attempts to first apply subsitution of variables in the spec 
 * and then fetch any dataset values that are required to normalize 
 * the section of the spec
*/
export const useNormalizeSpec= (spec: any) => {

  const [error, setError] = useState<string | null>(null);

  // Get a list of required variables for the spec from the global
  // state
  const requiredVariables = getRequiredVariableList(spec)
  const variables = useMaticoSelector((state) => _.pick(state.variables.autoVariables, requiredVariables));


  // Replace the parts of the spec that require variable replacement
  const specWithVariables = traverse(spec).map(function (node) {
        if (node && node.var) {
          const variableName = node.var.split(".")[0];
          const path = node.var.split(".").slice(1).join(".");
          const variable = variables[variableName];
          if (variable === null || variable === undefined) {
            console.warn("failed to find variable", variableName);
            return;
          }
          const value = _.at(variable.value, path)[0];
          this.update(value);
        }
  })


  const requiredDatasetMetrics  = getRequiredDatasetMetrics(specWithVariables)

  const datasetValues  = useRequestColumnStats(requiredDatasetMetrics)

  console.log("Dataset values are ", datasetValues)

  if(datasetValues.length==0){
    return [specWithVariables,true,null]
  }

  if(!datasetValues.every(dv=>dv && dv.state==='Done')){
    return [null,false,null]
  }

  let nodeNumber =0

  // Identify which data stats the spec needs 
  const fullyNormalized =  traverse(specWithVariables).map(function (node) {
        if (node && node.dataset) {
          this.update(datasetValues[nodeNumber].result)
          nodeNumber+=1
        }
      });

  return [fullyNormalized, true, error];
};
