import { wrap } from "comlink";
import { DatasetServiceInterface } from "Datasets/DatasetService";
import { DatasetState, DatasetSummary } from "Datasets/Dataset";

//@ts-ignore
import DatasetServiceWorker from "Datasets/DatasetServiceWorker.worker.ts";

export const DatasetServiceMiddleWare = () => {
  let worker: any | undefined;

  if (!worker) {
    worker = wrap<DatasetServiceInterface>(DatasetServiceWorker());
    console.log("Creating worker ", worker);
  }

  return (store: any) => (next: any) => (action: any) => {
    const state = store.getState();
    switch (action.type) {
      case "datasets/registerDataset":
        if (!state.datasets.datasets[action.payload.name]) {
          worker
            .registerDataset(action.payload)
            .then((datasetSummary: DatasetSummary) => {
              store.dispatch({
                type: "datasets/datasetReady",
                payload: datasetSummary,
              });
            })
            .catch((error: any) => {
              console.warn(
                "Something went wrong registering dataset",
                action.payload,
                error
              );
              store.dispatch({
                type: "datasets/datasetFiledToLoad",
                payload: {
                  ...action.payload,
                  error: error,
                },
              });
            });

          // Once we have started the loading process modify the message
          // To reflect this
          //
          return next({
            ...action,
            payload: { name: action.payload.name, state: DatasetState.LOADING },
          });
        }
      case "datasets/request_query":
        // worker.runQuery(action.payload).then(() => {
        //   store.dispatch({
        //     type: "dataset/QUERY_RESULTS",
        //     payload: {},
        //   });
        // });
        break;
      case "datasets/requestData":
        console.log("worker is ", worker)
        worker.getData(action.payload.datasetName,action.payload.filters, true).then((data)=>{
          console.log("Got data back from the dataset worker ", data)
          store.dispatch({
            type:"/datasets/gotData",
            payload:{
              datasetName: action.payload.datasetName,
              filters: action.payload.filters,
              requestHash: action.payload.requestHash,
              data
            }
          })     
        })
      default: 
        return next(action);
    }
  };
};
