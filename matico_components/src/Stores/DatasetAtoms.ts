import { atomFamily } from "recoil";
import * as comlink from "comlink"

//@ts-ignore
import { DataServiceWorker } from "Datasets/DatasetServiceWorker.worker?worler&inline"
import { DatasetServiceInterface } from "Datasets/DatasetService";

const DataService = comlink.wrap<DatasetServiceInterface>(DataServiceWorker());

const DatasetQueryUpdateEffect (query: DatasetQuery): AtomEffect<QueryResult> => {
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      setSelf(DataService.registerQuery((result: QueryResult) => {
        setSelf(result)
      }))
    }
    return () => DatasetService.unregisterQuery(query)
  }
}

const datasetQuery = atomFamily<QueryResult, DatasetQuery>({
  key: "datasetQueries",
  effects: (query) => [DatasetQueryUpdateEffect(query)],
})
