import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export interface EditorState {
    hoveredRef: string | null;
}

const initialState: EditorState = {
    hoveredRef: null
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setHoveredRef: (state, action: PayloadAction<string | null>) => {
            state.hoveredRef = action.payload;
        }
    }
});

export const {
    setHoveredRef,
} = editorSlice.actions;

export const selectHoveredRef = (state: EditorState) => state.hoveredRef;

export const editorReducer = editorSlice.reducer;
