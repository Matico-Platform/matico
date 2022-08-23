import { Active } from "@dnd-kit/core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export interface EditorState {
    hoveredRef: string | null;
    activeDragItem: Active | null;
}

const initialState: EditorState = {
    hoveredRef: null,
    activeDragItem: null
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setHoveredRef: (state, action: PayloadAction<string | null>) => {
            state.hoveredRef = action.payload;
        },
        setActiveDragItem: (state, action: PayloadAction<Active | null>) => {
            // this is quite dumb, but the Active objects have some additional prototypes
            // pull an Active into a redux store throws some errors, buth componentside and in Dnd kit
            state.activeDragItem = JSON.parse(JSON.stringify(action.payload)) as Active;
        }
    }
});

export const {
    setHoveredRef,
    setActiveDragItem
} = editorSlice.actions;

export const selectHoveredRef = (state: EditorState) => state.hoveredRef;

export const editorReducer = editorSlice.reducer;
