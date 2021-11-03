import React, { useEffect, useContext } from "react";
import {
  MaticoStateActionType,
  MaticoStateContext,
} from "../Contexts/MaticoStateContext/MaticoStateContext";

type AutoVariableInterface = {
  name: string;
  type?: string;
  initialValue?: any;
};

export const useAutoVariables = (variables: Array<AutoVariableInterface>) => {
  const { dispatch } = useContext(MaticoStateContext);
  const { state } = useContext(MaticoStateContext);
  const variableNames = variables.map((v) => v.name);
  const currentValues = state.autoVariables.filter((v) =>
    variableNames.includes(v.name)
  );
  useEffect(() => {
    variables.forEach((v) => {
      const { name, type, initialValue } = v;
      if (type !== undefined && initialValue !== undefined) {
        //TODO: OBS fix this... not sure how to properly do this union
        //@ts-ignore
        dispatch({
          type: MaticoStateActionType.SET_AUTO_VARIABLE,
          payload: {
            type,
            name,
            value: initialValue,
          },
        });
      }
    });

    return () => {
      variables.forEach((v) => {
        //@ts-ignore
        dispatch({
          type: MaticoStateActionType.UNREGISTER_AUTO_VARIABLE,
          payload: v.name,
        });
      });
    };
  }, [JSON.stringify(variables)]);

  const currentState = variables.reduce((agg, v) => {
    const { type, name } = v;
    const currentValue = state.autoVariables.find(
      (v) => v.name === name
    )?.value;
    const updateFunc = (value) => {
      dispatch({
        type: MaticoStateActionType.SET_AUTO_VARIABLE,
        payload: {
          type,
          name,
          value,
        },
      });
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
}: AutoVariableInterface) => {
  const { dispatch } = useContext(MaticoStateContext);
  const { state } = useContext(MaticoStateContext);
  const currentValue = state.autoVariables.find((v) => v.name === name)?.value;

  useEffect(() => {
    if (type !== undefined && initialValue !== undefined) {
      //TODO: OBS fix this... not sure how to properly do this union
      //@ts-ignore
      dispatch({
        type: MaticoStateActionType.SET_AUTO_VARIABLE,
        payload: {
          type,
          name,
          value: initialValue,
        },
      });
    }

    return () => {
      //@ts-ignore
      dispatch({
        type: MaticoStateActionType.UNREGISTER_AUTO_VARIABLE,
        payload: name,
      });
    };
  }, [type, name, JSON.stringify(initialValue)]);

  const updateVariable = (value: any) => {
    dispatch({
      type: MaticoStateActionType.SET_AUTO_VARIABLE,
      payload: {
        type,
        name,
        value,
      },
    });
  };

  return [currentValue, updateVariable];
};
