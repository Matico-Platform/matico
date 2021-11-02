import React, { useEffect, useContext } from 'react';
import {
    MaticoStateContext,
    MaticoStateActionType,
} from "../Contexts/MaticoStateContext/MaticoStateContext";

export const useRegisterAutoVariable = (name: string, type:string, value:any) => {
    const { dispatch } = useContext(MaticoStateContext);
    useEffect(() => {
        //TODO: OBS fix this... not sure how to properly do this union
        //@ts-ignore
        dispatch({
            type: MaticoStateActionType.REGISTER_AUTO_VARIABLE,
            payload: {
                type,
                name,
                value,
            },
        });

        return ()=>{
            //@ts-ignore
            dispatch({
                type: MaticoStateActionType.UNREGISTER_AUTO_VARIABLE,
                payload: name
            });
        }
    }, [type,name,value]);
}