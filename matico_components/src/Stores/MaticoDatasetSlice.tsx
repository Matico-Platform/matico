import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DatasetDetails, DatasetSummary, Filter } from "Datasets/Dataset";
import _ from "lodash";
// import { Dataset } from "../Datasets/Dataset";

// export type DatasetLoader = (config: any)=> Dataset;
//

export interface Query {
  state: "Loading" | "Error" | "Done";
  result: any;
}

export interface DatasetsState {
  datasets: { [datasetName: string]: DatasetDetails };
  queries: { [queryHash: string]: Query };
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
    registerDataset: (state, action: PayloadAction<DatasetSummary>) => {
      state.datasets[action.payload.name] = action.payload;
    },
    datasetReady: (state, action: PayloadAction<DatasetSummary>) => {
      state.datasets[action.payload.name] = action.payload;
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
    requestData: (
      state,
      action: PayloadAction<{
        datasetName: string;
        requestHash: string;
        filters: Array<Filter>;
      }>
    ) => {
      const { requestHash } = action.payload;
      state.datasets[requestHash] = { state: "Loading" };
    },
    gotData: (
      state,
      action: PayloadAction<{
        datasetName: string;
        filters: Array<Filter>;
        data: any;
        requestHash: string;
      }>
    ) => {
      const { data, requestHash } = action.payload;
      state.queries[requestHash] = { state: "Done", result: data };
    },
  },
});

export const { registerDataset, requestData} = datasetsSlice.actions;

export const datasetsReducer = datasetsSlice.reducer;
