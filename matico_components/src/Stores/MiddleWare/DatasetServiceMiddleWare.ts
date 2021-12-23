import { wrap } from "comlink";
import { DatasetServiceInterface } from "Datasets/DatasetService";

//@ts-ignore
import DatasetServiceWorker from "Datasets/DatasetServiceWorker.worker.ts";

export const DatasetServiceMiddleWare = () => {
  let worker: any | undefined;

  if (!worker) {
    worker = wrap<DatasetServiceInterface>(DatasetServiceWorker());
    console.log("Creating worker ", worker)
  }

  return (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
      case "datasets/registerDataset":
        console.log("intercepting register dataset", action,worker)
        worker.registerDataset(action.payload).then((stringRet: string)=>{
          console.log("called test func", stringRet)
        })
        // worker.registerDataset(action.payload).then(() => {
        //   console.log("Registered dataset ")
        //   store.dispatch({
        //     type: "datasets/datasetReady",
        //     payload: {},
        //   });
        // })
        // .catch((error:any)=>{
        //   store.dispatch({
        //     type:'datasets/failedToRegisterDataset',
        //     payload:{
        //       datasetName: action.payload.datasetName,
        //       error 
        //     }
        //   })
        // });

      case "datasets/request_query":
        // worker.runQuery(action.payload).then(() => {
        //   store.dispatch({
        //     type: "dataset/QUERY_RESULTS",
        //     payload: {},
        //   });
        // });
        break;
    }
    return next(action);
  };
};
