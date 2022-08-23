
import { useState, useEffect, useContext } from "react";
import traverse from "traverse";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import _, {update} from "lodash";
import { ColumnStatRequest } from "Stores/MaticoDatasetSlice";
import { useRequestColumnStats } from "./useRequestColumnStat";
import {updateNormalizedSpec} from "Stores/MaticoSpecSlice";
import {Variable} from "@maticoapp/matico_types/spec"

const getRequiredVariableList = (struct: any) => {
    const requiredVariables: Array<Variable> = [];
    traverse(struct).forEach((node: any) => {
        if (node && node.varId) {
            requiredVariables.push({varId: node.varId, property: node.property, bind: node.bind});
        }
    });
    return requiredVariables;
};

const getRequiredDatasetMetrics = (struct: any) => {
    const requiredDataMetrics: Array<ColumnStatRequest> = [];
    traverse(struct).forEach((node: any) => {
        if (node && node.dataset && node.metric) {
            const { dataset, column, feature_id, metric, filters } = node;
            const requiredMetric = {
                datasetName: dataset,
                column,
                metric: metric.type,
                parameters: metric,
                filters
            };
            requiredDataMetrics.push(requiredMetric);
        }
    });
    return requiredDataMetrics;
};
/**
 * Attempts to first apply subsitution of variables in the spec
 * and then fetch any dataset values that are required to normalize
 * the section of the spec
 */
export const useNormalizeSpec = () => {
  const [spec,loaded,errors] = useFullyNormalizeSpec();
  const dispatch = useMaticoDispatch();
  
  useEffect(()=>{
    if(loaded){
      dispatch(updateNormalizedSpec(spec)) 
    } 
  },[JSON.stringify(spec),loaded])

  return [spec,loaded,errors]
}

export const useFullyNormalizeSpec = ()=>{
    const spec = useMaticoSelector((selector)=>selector.spec.spec)
    const dispatch = useMaticoDispatch()
    const [error, setError] = useState<string | null>(null);

    // Get a list of required variables for the spec from the global
    // state
    const requiredVariables = getRequiredVariableList(spec);
  
    const variables = useMaticoSelector((state) =>{
        let requiredVariableValues : Record<string,any> = {}
        requiredVariables.forEach(rv=> requiredVariableValues[rv.varId] = state.variables.autoVariables[rv.varId])
        return requiredVariableValues
    });

    // Replace the parts of the spec that require variable replacement
    const specWithVariables = traverse(spec).map(function (node) {
        if (node && node.varId) {
            const variableId= node.varId;
            const property = node.property;
            const variable = variables[variableId]
            if (variable === null || variable === undefined) {
                return;
            }
            const value = property ? variable.value.value  : variable.value.value[property]
            this.update(variable);
        }
    });

    const requiredDatasetMetrics = getRequiredDatasetMetrics(specWithVariables);

    const datasetValues = useRequestColumnStats(requiredDatasetMetrics);

    if (datasetValues.length == 0) {
        return [specWithVariables, true, null];
    }


    let nodeNumber = 0;

    // Identify which data stats the spec needs
    const fullyNormalized = traverse(specWithVariables).map(function (node) {
        if (node && node.metric) {
            if(datasetValues[nodeNumber] && datasetValues[nodeNumber].state==="Done"){
              this.update(datasetValues[nodeNumber].result);
            }
            nodeNumber += 1;
        }
    });


    return [fullyNormalized,true,null];
};
;
