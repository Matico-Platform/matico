import { PayloadAction } from "@reduxjs/toolkit";
import { MaticoStateVariable } from "./VariableTypes";
export interface VariableState {
    autoVariables: {
        [name: string]: MaticoStateVariable;
    };
    variables: Array<MaticoStateVariable>;
}
export declare const variableSlice: import("@reduxjs/toolkit").Slice<VariableState, {
    setAutoVariable: (state: import("immer/dist/internal").WritableDraft<VariableState>, action: PayloadAction<MaticoStateVariable>) => void;
    unregisterAutoVariable: (state: import("immer/dist/internal").WritableDraft<VariableState>, action: PayloadAction<string>) => void;
}, "variables">;
export declare const setAutoVariable: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, unregisterAutoVariable: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>;
export declare const selectAutoVariables: (state: VariableState) => {
    [name: string]: MaticoStateVariable;
};
export declare const variableReducer: import("redux").Reducer<VariableState, import("redux").AnyAction>;
