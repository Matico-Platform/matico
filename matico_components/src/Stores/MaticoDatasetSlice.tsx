import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
// import { Dataset } from "../Datasets/Dataset";

// export type DatasetLoader = (config: any)=> Dataset;

export interface DatasetsState {
  datasets: { [datasetName: string]: any };
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
      action: PayloadAction<{ datasetName: string; datasetDetails: any }>
    ) => {
      state.datasets[action.payload.datasetName] =
        action.payload.datasetDetails;
    },
    datasetReady: (
      state,
      action: PayloadAction<{ datasetName: string; datasetDetails: any }>
    ) => {
      state.datasets[action.payload.datasetName] =
        action.payload.datasetDetails;
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
