import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard, Page } from "@maticoapp/matico_spec";
import _ from "lodash";
import { Dataset } from "../Datasets/Dataset";
import {
  extractEditType,
  getPathIndex,
  getParentPath,
  incrementName
} from '../Utils/specUtils';

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
      state.spec = action.payload;
    },
    addDataset: (state, action: PayloadAction<{ dataset: Dataset }>) => {
      state.spec.datasets.push(action.payload.dataset);
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
      action: PayloadAction<{
        editPath: string | null;
        editType: string | null;
      }>
    ) => {
      state.currentEditPath = action.payload.editPath;
      state.currentEditType = action.payload.editType;
    },
    setSpecAtPath: (
      state,
      action: PayloadAction<{ editPath: string; update: any }>
    ) => {
      let newSpec = { ...state.spec };
      if (action.payload.editPath === "") {
        newSpec = { ...newSpec, ...action.payload.update };
      } else {
        newSpec = { ...state.spec };
        const oldEntry = _.get(state.spec, action.payload.editPath);
        _.set(newSpec, action.payload.editPath, {
          ...oldEntry,
          ...action.payload.update,
        });
      }
      state.spec = newSpec;
      console.log("New spec is ", newSpec);
    },
    deleteSpecAtPath: (state, action: PayloadAction<{ editPath: string }>) => {
      // delete entry, but retains an empty objtect
      const newSpec = { ...state.spec };
      _.unset(newSpec, action.payload.editPath);
      state.spec = newSpec;
    },
    removeSpecAtPath: (state, action: PayloadAction<{ editPath: string }>) => {
      const newSpec = { ...state.spec };
      const parentPath = getParentPath(action.payload.editPath);
      const parentEntries = _.get(state.spec, parentPath);
      const entryIndex = getPathIndex(action.payload.editPath);

      parentEntries.splice(entryIndex, 1);
      _.set(newSpec, parentPath, parentEntries);
      
      state.spec = newSpec;
    },
    reorderAtSpec: (state, action: PayloadAction<{ editPath: string, direction: string }>) => {
      const newSpec = { ...state.spec };
      const parentPath = getParentPath(action.payload.editPath);
      const parentEntries = _.get(state.spec, parentPath);
      const entryIndex = getPathIndex(action.payload.editPath);

      if (
        (entryIndex === 0 && action.payload.direction === "forward") ||
        (entryIndex === parentEntries.length - 1 && action.payload.direction === "backward")
      ) {
        return;
      }

      const movingEntry = parentEntries.splice(entryIndex, 1)[0];
      switch(action.payload.direction) {
        case 'forward':
          parentEntries.splice(entryIndex - 1, 0, movingEntry);
          break;
        case 'toFront':
          parentEntries.splice(0, 0, movingEntry);
          break;
        case 'toBack':
          parentEntries.splice(parentEntries.length, 0, movingEntry);
          break;
        case 'backward':
          parentEntries.splice(entryIndex + 1, 0, movingEntry);
          break;
      }
      _.set(newSpec, parentPath, parentEntries);
      state.spec = newSpec;

    },
    duplicateSpecAtPath: (
      state,
      action: PayloadAction<{ editPath: string }>
    ) => { 
      const newSpec = { ...state.spec };

      const parentPath = getParentPath(action.payload.editPath);
      const oldParentEntries = _.get(state.spec, parentPath);
      const entryIndex = getPathIndex(action.payload.editPath);
      const outerTagged = !('name' in oldParentEntries[entryIndex]);
      //@ts-ignore
      const takenNames = outerTagged
        ? oldParentEntries.map(entry => Object.entries(entry)[0][1]?.name)
        : oldParentEntries.map(entry => entry.name)
      
      const [
        entryType,
        entryContent
      ] = outerTagged 
        ? Object.entries(oldParentEntries[entryIndex])[0]
        : [null, oldParentEntries[entryIndex]];
      
      const newEntry = 
        outerTagged
        ? {
          [entryType]: {
            ..._.cloneDeep(entryContent),
            name:incrementName(entryContent.name, takenNames)
          }
        }
        : {
          ..._.cloneDeep(entryContent),
          name:incrementName(entryContent.name, takenNames)
        }
      
      _.set(newSpec, parentPath, [
        ...oldParentEntries,
        newEntry
      ]);
      
      state.spec = newSpec;
    },
    reconcileSpecAtPath: (
      state,
      action: PayloadAction<{ editPath: string, update: any }>
    ) => {
      let newSpec = { ...state.spec };
      if (action.payload.editPath === "") {
        newSpec = { ...newSpec, ...action.payload.update };
      } else {
        newSpec = { ...state.spec };
        const oldEntry = _.get(state.spec, action.payload.editPath);
        _.set(newSpec, action.payload.editPath, 
          _.merge(oldEntry, action.payload.update)
        );
      }
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
  deleteSpecAtPath,
  removeSpecAtPath,
  duplicateSpecAtPath,
  reconcileSpecAtPath,
  reorderAtSpec,
  addDataset,
} = stateSlice.actions;

export const selectSpec = (state: SpecState) => state.spec;

export const specReducer = stateSlice.reducer;
