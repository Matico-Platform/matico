import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DatasetState, DatasetSummary, Filter } from "Datasets/Dataset";
import _ from "lodash";
// import { Dataset } from "../Datasets/Dataset";

// export type DatasetLoader = (config: any)=> Dataset;
//

export interface Query {
  state: "Loading" | "Error" | "Done";
  result: any;
}

export interface DatasetsState {
  datasets: { [datasetName: string]: DatasetSummary};
  queries: { [queryHash: string]: Query };
  loaders: { [loaderName: string]: any };
}

export interface ColumnStatRequest{
  datasetName: string,
  column: string, 
  metric: string,
  parameters: {[param:string]: any},
  filters: Array<Filter>
}

export interface DataRequest{
  datasetName: string,
  filters: Array<Filter>
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
    // Also triggers middleware 
    registerDataset: (state, action: PayloadAction<DatasetSummary>) => {
      state.datasets[action.payload.name] = action.payload;
    },
    datasetReady: (state, action: PayloadAction<DatasetSummary>) => {
      state.datasets[action.payload.name] = action.payload;
    },
    datasetFailedToLoad: (
      state,
      action: PayloadAction< DatasetSummary>
    ) => {
      state.datasets[action.payload.name] = {
        state: DatasetState.ERROR,
        ...action.payload
      };
    },
    // Also triggers middleware
    registerDataUpdates: (
      state,
      action: PayloadAction<{
        datasetName: string;
        requestHash: string;
        filters?: Array<Filter>;
        includeGeo?:boolean;
        notifierId:string;
      }>
    ) => {
      const { requestHash } = action.payload;
      state.queries[requestHash] = { state: "Loading", result:null};
    },
    // Also triggers middleware
    registerColumnStatUpdates:(
      state,
      action: PayloadAction<{requestHash: string, args: ColumnStatRequest, notifierId: string}>
    ) =>{
      const {requestHash,args} = action.payload ;
      state.queries[requestHash] = {state:"Loading", result:null}
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
      // if (
      //   state.queries[requestHash] && state.queries[requestHash].state === "Done" 
      // ) {
      //   // do no dispatch
      // } else {
        state.queries[requestHash] = { state: "Done", result: data };
      // }
    },
  },
});

export const { registerDataset, registerDataUpdates, registerColumnStatUpdates} = datasetsSlice.actions;

export const datasetsReducer = datasetsSlice.reducer;
