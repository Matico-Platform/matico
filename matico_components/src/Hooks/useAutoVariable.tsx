import { useEffect } from "react";
import { useMaticoDispatch, useMaticoSelector } from "./redux";

import {
    setAutoVariable,
    unregisterAutoVariable,
    updateAutoVariable
} from "../Stores/MaticoVariableSlice";
import { MaticoStateVariable, VariableValue } from "Stores/VariableTypes";

export type AutoVariableInterface = {
    variable: MaticoStateVariable;
    bind?: boolean;
};

export const useAutoVariables = (variables: Array<AutoVariableInterface>) => {
    const dispatch = useMaticoDispatch();
    const autoVariables = useMaticoSelector(
        (state) => state.variables.autoVariables
    );

    useEffect(() => {
        variables.forEach((v) => {
            const { variable, bind } = v;
            if (!autoVariables[variable.id]) {
                dispatch(setAutoVariable(variable));
            }
        });
    }, [JSON.stringify(variables)]);

    const currentState = variables.reduce<
        Record<
            string,
            { value: VariableValue; update: (value: VariableValue) => void }
        >
    >((agg, variable) => {
        const { id, name, value, paneId } = variable.variable;
        const currentValue = autoVariables[id]?.value;
        const updateFunc = (value: VariableValue) => {
            if (variable.bind) {
                dispatch(updateAutoVariable({ id, value }));
            } else {
                console.info(
                    `Not updating variable ${name} because bind is not set`
                );
            }
        };
        agg[name] = { value: currentValue, update: updateFunc };
        return agg;
    }, {});

    return currentState;
};

// Just name if existing variable, otherwise type and value (MaticoVariable type) to register and return update function
export const useAutoVariable = ({
    variable,
    bind
}: AutoVariableInterface): [VariableValue, (update: VariableValue) => void] => {
    const dispatch = useMaticoDispatch();

    const autoVariables = useMaticoSelector(
        (state) => state.variables.autoVariables
    );

    const currentValue = autoVariables[variable.id]?.value;

    useEffect(() => {
        if (variable) {
            if (!currentValue && bind) {
                dispatch(setAutoVariable(variable));
            }
        }
        //return () => {
        //    //@ts-ignore
        //    dispatch(unregisterAutoVariable(name));
        //};
    }, [variable, currentValue]);

    const updateVariable = (value: VariableValue) => {
        if (value.type !== variable.value.type) {
            throw new Error("Update does not match type of variable");
        }
        if (bind) {
            dispatch(updateAutoVariable({ id: variable.id, value }));
        } else {
            console.info(
                `Not updating variable ${name} because bind is not set`
            );
        }
    };

    return [currentValue, updateVariable];
};
