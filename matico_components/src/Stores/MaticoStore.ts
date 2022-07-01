import { configureStore } from "@reduxjs/toolkit";
import { datasetsReducer } from "./MaticoDatasetSlice";
import { specReducer } from "./MaticoSpecSlice";
import { variableReducer } from "./MaticoVariableSlice";
import { DatasetServiceMiddleWare } from "./MiddleWare/DatasetServiceMiddleWare";

export const store = configureStore({
    reducer: {
        variables: variableReducer,
        spec: specReducer,
        datasets: datasetsReducer
    },
    middleware: [DatasetServiceMiddleWare()]
});

export type MaticoState = ReturnType<typeof store.getState>;
export type MaticoDispatch = typeof store.dispatch;
