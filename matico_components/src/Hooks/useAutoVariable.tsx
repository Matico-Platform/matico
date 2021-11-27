import React, { useEffect, useContext } from "react";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

import {
  setAutoVariable,
  unregisterAutoVariable,
} from "../Stores/MaticoVariableSlice";

export type AutoVariableInterface = {
  name: string;
  type?: string;
  initialValue?: any;
  bind?: boolean;
};

export const useAutoVariables = (variables: Array<AutoVariableInterface>) => {
  const dispatch = useMaticoDispatch();
  const autoVariables = useMaticoSelector((state) => state.variables.autoVariables);

  useEffect(() => {
    variables.forEach((v) => {
      const { name, type, initialValue, bind } = v;
      if (type !== undefined && initialValue !== undefined) {
        dispatch(
          setAutoVariable({
            type,
            name,
            value: initialValue,
          })
        );
      }
    });

    return () => {
      variables.forEach((v) => {
        //@ts-ignore
        dispatch(unregisterAutoVariable(v.name));
      });
    };
  }, [JSON.stringify(variables)]);

  const currentState = variables.reduce((agg, variable) => {
    const { type, name, bind } = variable;
    const currentValue = autoVariables[name]?.value;
    const updateFunc = (value) => {
      if (bind) {
        dispatch(
          setAutoVariable({
            type,
            name,
            value,
          })
        );
      } else {
        console.info(`Not updating variable ${name} because bind is not set`);
      }
    };
    agg[name] = { value: currentValue, update: updateFunc };
    return agg;
  }, {});

  return currentState;
};

// Just name if existing variable, otherwise type and value (MaticoVariable type) to register and return update function
export const useAutoVariable = ({
  name,
  type,
  initialValue,
  bind,
}: AutoVariableInterface) => {

  const dispatch = useMaticoDispatch();
  const autoVariables = useMaticoSelector((state) => state.variables.autoVariables);
  const currentValue = autoVariables[name]?.value;

  useEffect(() => {
    if (type !== undefined && initialValue !== undefined) {
      dispatch(
        setAutoVariable({
          type,
          name,
          value: initialValue,
        }))
    }

    return () => {
      //@ts-ignore
      dispatch(unregisterAutoVariable(name));
    };
  }, [type, name, JSON.stringify(initialValue)]);

  const updateVariable = (value: any) => {
    if (bind) {
      dispatch(setAutoVariable({
          type,
          name,
          value,
        }));
    } else {
      console.info(`Not updating variable ${name} because bind is not set`);
    }
  };

  return [currentValue, updateVariable];
};
