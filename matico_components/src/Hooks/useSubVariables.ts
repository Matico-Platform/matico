import { useState, useEffect, useContext } from "react";
import traverse from "traverse";
import { useVariableSelector } from "./redux";
import _ from "lodash";
import { MaticoDataContext } from "../Contexts/MaticoDataContext/MaticoDataContext";
import { Dataset } from "../Datasets/Dataset";


const getRequiredVariableList =(struct)=>{
  const requiredVariables = [] 
  const requiredDatasets = []
  traverse(struct).forEach((node:any)=>{
    if(node && node.var){
      requiredVariables.push(node.var.split(".")[0])
    }
    if(node && node.dataset){
      requiredDatasets.push(node.dataset)
    }
  })
  return {requiredVariables,requiredDatasets}
}

export const useSubVariables = (struct: any) => {
  const state = useVariableSelector((state) => state.variables.autoVariables);
  const { state: dataState } = useContext(MaticoDataContext);
  const { datasets, datasetStates } = dataState;
  const [mappedStructure, setMappedStructure] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {requiredVariables, requiredDatasets} = getRequiredVariableList(struct)

  useEffect(() => {
    setLoading(true);
    try {
      const result = traverse(struct).map(function (node) {
        if (node && node.var) {
          const variableName = node.var.split(".")[0];
          const path = node.var.split(".").slice(1).join(".");
          const variable = state[variableName];
          if (variable === null || variable === undefined) {
            console.warn("failed to find variable", variableName);
            return;
          }
          const value = _.at(variable.value, path)[0];
          this.update(value);
        }
        if (node && node.dataset) {
          const dataset = datasets.find(
            (d: Dataset) => d.name === node.dataset
          );

          if (!dataset) throw Error("Dataset not found");
          const [metric, metricArgs] = Object.entries(node.metric)[0];
          switch (metric) {
            case "Max":
              const max = dataset.getColumnMax(node.column);
              this.update(max);
              break;
            case "Min":
              const min = dataset.getColumnMin(node.column);
              this.update(min);
              break;
            case "EqualInterval":
              this.update(
              //@ts-ignore
                dataset.getEqualIntervalBins(node.column, metricArgs.bins)
              );
              break;
            case "Quantile":
              this.update(
              //@ts-ignore
                dataset.getQuantileBins(node.column, metricArgs.bins)
              );
          }
        }
      });
      setMappedStructure(result);
      setLoading(false);
    } catch (error) {
      console.log("was unable to find dataset ");
    }
  }, [
    JSON.stringify(struct),
    JSON.stringify(_.pick(state, requiredVariables)),
    JSON.stringify(_.pick(datasetStates,requiredDatasets)),
  ]);

  return [mappedStructure, !loading, error];
};
