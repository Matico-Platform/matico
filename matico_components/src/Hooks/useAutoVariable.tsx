import React, { useEffect, useContext } from "react";
import {
  MaticoStateActionType,
  MaticoStateContext,
} from "../Contexts/MaticoStateContext/MaticoStateContext";

export type AutoVariableInterface = {
  name: string;
  type?: string;
  initialValue?: any;
  bind?: boolean;
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
      const { name, type, initialValue, bind } = v;
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

  const currentState = variables.reduce((agg, variable) => {
    const { type, name, bind } = variable;
    const currentValue = state.autoVariables.find(
      (v) => v.name === name
    )?.value;
    const updateFunc = (value) => {
      if (bind) {
        dispatch({
          type: MaticoStateActionType.SET_AUTO_VARIABLE,
          payload: {
            type,
            name,
            value,
          },
        });
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
    if (bind) {
      dispatch({
        type: MaticoStateActionType.SET_AUTO_VARIABLE,
        payload: {
          type,
          name,
          value,
        },
      });
     } else {
       console.info(`Not updating variable ${name} because bind is not set`);
     }
  };

  return [currentValue, updateVariable];
};
