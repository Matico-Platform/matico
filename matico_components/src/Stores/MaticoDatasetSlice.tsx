import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {DatasetDetails, DatasetSummary} from 'Datasets/Dataset'
import _ from "lodash";
// import { Dataset } from "../Datasets/Dataset";

// export type DatasetLoader = (config: any)=> Dataset;

export interface DatasetsState {
  datasets: { [datasetName: string]: DatasetDetails};
  queries: { [queryHash: string]: any };
  loaders: { [loaderName: string]: any };
}

const initialState: DatasetsState = {
  datasets: {},
  queries: {},
  loaders: {},
};

export const datasetsSlice = createSlice({
  name: "datasets",
  initialState,
  reducers: {
    registerDataset: (
      state,
      action: PayloadAction<DatasetSummary>
    ) => {
      state.datasets[action.payload.name] =
        action.payload;
    },
    datasetReady: (
      state,
      action: PayloadAction<DatasetSummary>
    ) => {
      state.datasets[action.payload.name] =
        action.payload;
    },
    failedToRegisterDataset: (
      state,
      action: PayloadAction<{ datasetName: string; error: any }>
    ) => {
      state.datasets[action.payload.datasetName] = {
        state: "failed",
        error: action.payload.error,
      };
    },
  },
});

export const {registerDataset} = datasetsSlice.actions;

export const datasetsReducer = datasetsSlice.reducer;
