import { wrap } from "comlink";
import { DatasetServiceInterface } from "Datasets/DatasetService";
import { DatasetState, DatasetSummary } from "Datasets/Dataset";
import * as comlink from "comlink";

//@ts-ignore
import DatasetServiceWorker from "Datasets/DatasetServiceWorker.worker.ts";

export const DatasetServiceMiddleWare = () => {
    let worker: any | undefined;

    if (!worker) {
        worker = wrap<DatasetServiceInterface>(DatasetServiceWorker());
    }

    return (store: any) => (next: any) => (action: any) => {
        const state = store.getState();
        switch (action.type) {
            case "datasets/registerOrUpdateDataset":
                worker
                    .registerOrUpdateDataset(action.payload)
                    .then((datasetSummary: DatasetSummary) => {
                        store.dispatch({
                            type: "datasets/datasetReady",
                            payload: datasetSummary
                        });
                    })
                    .catch((error: any) => {
                        console.warn(
                            "Something went wrong registering dataset",
                            action.payload,
                            error
                        );
                        store.dispatch({
                            type: "datasets/datasetFailedToLoad",
                            payload: {
                                ...action.payload,
                                error: error.error
                            }
                        });
                    });

                // Once we have started the loading process modify the message
                // To reflect this
                //
                return next({
                    ...action,
                    payload: {
                        name: action.payload.name,
                        state: DatasetState.LOADING
                    }
                });
                break;
            case "datasets/request_query":
                // worker.runQuery(action.payload).then(() => {
                //   store.dispatch({
                //     type: "dataset/QUERY_RESULTS",
                //     payload: {},
                //   });
                // });
                break;
            case "datasets/registerColumnStatUpdates":
                const onStatsUpdate = (data: Array<any>) => {
                    store.dispatch({
                        type: "datasets/gotData",
                        payload: {
                            datasetName: action.payload.args.datasetName,
                            filters: action.payload.args.filters,
                            requestHash: action.payload.requestHash,
                            data
                        }
                    });
                };

                console.log(
                    "Registering for Column Data",
                    action.payload.args,
                    action.payload.notifierId
                );

                worker.registerColumnData(
                    action.payload.args,
                    action.payload.notifierId,
                    comlink.proxy(onStatsUpdate)
                );
                break;

            case "datasets/registerDataUpdates":
                const onDataUpdate = (data: Array<any>) => {
                    store.dispatch({
                        type: "datasets/gotData",
                        payload: {
                            datasetName: action.payload.datasetName,
                            filters: action.payload.filters,
                            requestHash: action.payload.requestHash,
                            data
                        }
                    });
                };

                worker.registerForUpdates(
                    action.payload.datasetName,
                    comlink.proxy(onDataUpdate),
                    action.payload.notifierId,
                    action.payload.filters,
                    action.payload.columns,
                    action.payload.limit
                );
                break;
            default:
                return next(action);
        }
    };
};
