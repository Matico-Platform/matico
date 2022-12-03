import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaticoStateVariable, VariableValue } from "./VariableTypes";

export interface VariableState {
    autoVariables: { [id: string]: MaticoStateVariable };
    variables: Array<MaticoStateVariable>;
}

const initialState: VariableState = {
    autoVariables: {},
    variables: []
};

export const variableSlice = createSlice({
    name: "variables",
    initialState,
    reducers: {
        setAutoVariable: (
            state,
            action: PayloadAction<MaticoStateVariable>
        ) => {
            state.autoVariables[action.payload.id] = action.payload;
        },
        updateAutoVariable: (
            state,
            action: PayloadAction<{ id: string; value: VariableValue }>
        ) => {
            state.autoVariables[action.payload.id].value = action.payload.value;
        },
        unregisterAutoVariable: (state, action: PayloadAction<string>) => {
            delete state.autoVariables[action.payload];
        }
    }
});

export const { setAutoVariable, unregisterAutoVariable, updateAutoVariable } =
    variableSlice.actions;

export const selectAutoVariables = (state: VariableState) =>
    state.autoVariables;

export const variableReducer = variableSlice.reducer;
