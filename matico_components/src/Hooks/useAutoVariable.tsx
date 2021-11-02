import React, { useEffect, useContext } from 'react';
import {
    MaticoStateActionType,
    MaticoStateContext
} from "../Contexts/MaticoStateContext/MaticoStateContext";

// Just name if existing variable, otherwise type and value (MaticoVariable type) to register and return update function
export const useAutoVariable = (name: string, type?:string, initialValue?:any) => {
    const { dispatch } = useContext(MaticoStateContext);
    const { state } = useContext(MaticoStateContext);
    const currentValue = state.autoVariables.find(v => v.name === name)?.value;

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

        return ()=>{
            //@ts-ignore
            dispatch({
                type: MaticoStateActionType.UNREGISTER_AUTO_VARIABLE,
                payload: name
            });
        }
    }, [type,name,JSON.stringify(initialValue)]);

    const updateVariable = (value:any) => {
        dispatch({
            type: MaticoStateActionType.SET_AUTO_VARIABLE,
            payload: {
                type,
                name,
                value
            }   
        })
    }

    return [
        currentValue,
        updateVariable
    ]
}