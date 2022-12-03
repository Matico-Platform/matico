import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DatasetState, DatasetSummary } from "Datasets/Dataset";
import {
    Filter,
    Dataset as DatasetSpec,
    DatasetTransform
} from "@maticoapp/matico_types/spec";
import _ from "lodash";
import { MaticoErrorType, registerError } from "./MaticoErrorSlice";
import { TransformStepError } from "Datasets/DatasetTransformRunner";

export interface Query {
    state: "Loading" | "Error" | "Done";
    result: any;
}
export interface TransformResult {
    state: "Loading" | "Error" | "Done";
    result: any;
    error: TransformStepError | null;
}

export interface DatasetsState {
    datasets: { [datasetName: string]: DatasetSummary };
    queries: { [queryHash: string]: Query };
    transforms: { [transformId: string]: TransformResult };
    loaders: { [loaderName: string]: any };
}

export interface ColumnStatRequest {
    datasetName: string;
    column: string;
    metric: string;
    parameters: { [param: string]: any };
    filters: Array<Filter>;
}

export interface DataRequest {
    datasetName: string;
    filters: Array<Filter>;
}

export interface FeatureRequest {
    datasetName: string;
    ids: Array<number>;
    columns?: Array<string>;
}

const initialState: DatasetsState = {
    datasets: {},
    queries: {},
    transforms: {},
    loaders: {}
};

export const datasetsSlice = createSlice({
    name: "datasets",
    initialState,
    reducers: {
        // Also triggers middleware
        registerColumnStatUpdates: (
            state,
            action: PayloadAction<{
                requestHash: string;
                args: ColumnStatRequest;
                notifierId: string;
            }>
        ) => {
            const { requestHash, args } = action.payload;
            state.queries[requestHash] = { state: "Loading", result: null };
        },
        // Also triggers middleware
        unregisterDataset: (state, action: PayloadAction<DatasetSpec>) => {
            delete state.datasets[action.payload.name];
        },
        // Also triggers middleware
        registerOrUpdateDataset: (
            state,
            action: PayloadAction<DatasetSpec>
        ) => {
            state.datasets[action.payload.name] = {
                name: action.payload.name,
                state: DatasetState.LOADING,
                spec: action.payload
            };
        },
        registerOrUpdateTransform: (
            state,
            action: PayloadAction<DatasetTransform>
        ) => {
            if (state.datasets[action.payload.name]) {
                state.datasets[action.payload.name].state =
                    DatasetState.LOADING;
            } else {
                state.datasets[action.payload.name] = {
                    name: action.payload.name,
                    state: DatasetState.LOADING,
                    spec: action.payload,
                    transform: true
                };
            }
        },
        datasetReady: (state, action: PayloadAction<DatasetSummary>) => {
            state.datasets[action.payload.name] = action.payload;
        },
        datasetFailedToLoad: (state, action: PayloadAction<DatasetSummary>) => {
            state.datasets[action.payload.name] = {
                state: DatasetState.ERROR,
                ...action.payload
            };
        },
        // Also triggers middleware
        requestTransform: (state, action: PayloadAction<DatasetTransform>) => {
            state.transforms[action.payload.id] = {
                result: null,
                error: null,
                state: "Loading"
            };
        },
        gotTransformResult: (
            state,
            action: PayloadAction<{
                transformId: string;
                result: Array<any>;
                error: TransformStepError;
            }>
        ) => {
            const { transformId, error, result } = action.payload;
            state.transforms[transformId] = {
                state: error ? "Error" : "Done",
                result,
                error
            };
        },
        requestFeatures: (
            state,
            action: PayloadAction<{
                notifierId: string;
                args: FeatureRequest;
            }>
        ) => {
            state.queries[action.payload.notifierId] = {
                state: "Loading",
                result: null
            };
        },
        gotFeatures: (
            state,
            action: PayloadAction<{
                result: any;
                notifierId: string;
            }>
        ) => {
            const { result, notifierId } = action.payload;
            state.queries[notifierId] = { state: "Done", result };
        },

        featureRequestFailed: (
            state,
            action: PayloadAction<{
                error: string;
                notifierId: string;
                result: any;
            }>
        ) => {
            state.queries[action.payload.notifierId] = {
                state: "Error",
                result: action.payload.result
            };
        },
        // Also triggers middleware
        registerDataUpdates: (
            state,
            action: PayloadAction<{
                datasetName: string;
                requestHash: string;
                limit?: number;
                filters?: Array<Filter>;
                columns?: Array<string>;
                notifierId: string;
            }>
        ) => {
            const { requestHash } = action.payload;
            if (state.queries[requestHash]) {
                state.queries[requestHash].state = "Loading";
            } else {
                state.queries[requestHash] = { state: "Loading", result: null };
            }
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
        }
    }
});

export const {
    registerOrUpdateDataset,
    registerDataUpdates,
    registerColumnStatUpdates,
    registerOrUpdateTransform,
    unregisterDataset,
    requestTransform,
    requestFeatures
} = datasetsSlice.actions;

export const datasetsReducer = datasetsSlice.reducer;
