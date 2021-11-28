import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard, Page } from "matico_spec";
import _ from "lodash";

export interface SpecState {
  spec: Dashboard | undefined;
  editing: boolean;
  currentEditPath?: string;
  currentEditType?: string;
}

const initialState: SpecState = {
  spec: undefined,
  editing: false,
};

export const stateSlice = createSlice({
  name: "variables",
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.editing = action.payload;
    },
    setSpec: (state, action: PayloadAction<Dashboard>) => {
      console.log("setting spec in action ", action.payload);
      state.spec = action.payload;
    },
    specUpdateAtPath: (
      state,
      action: PayloadAction<{ path: string; update: any }>
    ) => {
      state;
    },
    addPage: (state, action: PayloadAction<{ page: Page }>) => {
      state.spec.pages.push(action.payload.page);
    },
    removePage: (state, action: PayloadAction<{ pageName: string }>) => {
      const newPages = state.spec.pages.filter(
        (p) => p.name !== action.payload.pageName
      );
      state.spec.pages = newPages;
    },
    setCurrentEditPath: (
      state,
      action: PayloadAction<{ editPath: string | null; editType: string | null }>
    ) => {
      state.currentEditPath = action.payload.editPath;
      state.currentEditType = action.payload.editType;
    },
    setSpecAtPath: (
      state,
      action: PayloadAction<{ editPath: string; update: any }>
    ) => {
      const newSpec = { ...state.spec };
      const oldEntry = _.get(state.spec, action.payload.editPath);
      _.set(newSpec, action.payload.editPath, {
        ...oldEntry,
        ...action.payload.update,
      });
      state.spec = newSpec;
    },
    deleteSpecAtPath: (state, action: PayloadAction<{ editPath: string }>) => {
      const newSpec = { ...state.spec };
      _.unset(newSpec, action.payload.editPath);
      state.spec = newSpec;
    },
  },
});

export const {
  setEditing,
  setSpec,
  addPage,
  removePage,
  setCurrentEditPath,
  setSpecAtPath,
  deleteSpecAtPath
} = stateSlice.actions;

export const selectSpec = (state: SpecState) => state.spec;

export const specReducer = stateSlice.reducer;
