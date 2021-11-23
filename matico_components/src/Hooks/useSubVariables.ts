import { useMemo, useContext } from "react";
import traverse from "traverse";
import { useVariableSelector } from "./redux";
import _ from "lodash";
import { MaticoDataContext } from "../Contexts/MaticoDataContext/MaticoDataContext";
import { Dataset } from "../Datasets/Dataset";

export const useSubVariables = (struct: any) => {
  const state = useVariableSelector((state) => state.variables.autoVariables);
  const { state: dataState } = useContext(MaticoDataContext);
  const { datasets, datasetStates } = dataState;

  return useMemo(() => {
    try {
      return traverse(struct).map(function (node) {
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
          switch (node.metric) {
            case "Max":
              const max = dataset.getColumnMax(node.column);
              console.log("max is ,", max);
              this.update(max);
              break;
            case "Min":
              const min = dataset.getColumnMin(node.column);
              console.log("min is min ", min);
              this.update(min);
              break;
          }
        }
      });
    } catch {
      return null;
    }
  }, [
    JSON.stringify(struct),
    JSON.stringify(state),
    JSON.stringify(datasetStates),
  ]);
};
