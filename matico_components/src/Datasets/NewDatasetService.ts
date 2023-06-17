import { Dataset, DatasetTransform } from "@maticoapp/matico_types/spec";
import { CSVBuilder } from "./Builders/CSVBuilder";
import { Column } from "./Dataset";
import { DatasetQuery, QueryResult } from "./DatasetQueries";
import { LocalDataset } from "./LocalDataset";

type Notifier = () => void

export type DatasetSummary = {
  name: string,
  columns?: Array<Column>,
  errors?: Array<string>,
  shape?: [number, number],
}

export interface DatasetServiceInterface {
  registerOrUpdateDataset: (dataset: Dataset) => Promise<DatasetSummary>;
  unregisterDataset: (datasetName: string) => void;
  unregisterTransform: (transform: DatasetTransform) => void;
  registerDatasetQuery: (query: DatasetQuery, onQueryUpdated?: Notifier) => Promise<QueryResult>;
  registerOrUpdateTransform: (transform: DatasetTransform, onUpdated?: (transform: DatasetSummary) => void) => Promise<DatasetSummary>;
}

export class DatasetService implements DatasetServiceInterface {
  _datasets: Record<string, LocalDataset> = {};
  _notificationSubscriptions: Record<string, Array<Notifier>> = {};

  _notify(datasetName: string) {
    if (!(datasetName in this._notificationSubscriptions)) return
    let notificationList = this._notificationSubscriptions[datasetName]
    Object.values(notificationList).forEach((notifier: Notifier) => {
      notifier()
    });
  }

  _registerNotifier(datasetName: string, onUpdate: Notifier) {
    if (datasetName in this._notificationSubscriptions) {
      this._notificationSubscriptions[datasetName].push(onUpdate)
      return
    }
    this._notificationSubscriptions[datasetName] = [onUpdate]

  }

  async registerOrUpdateDataset(dataset: Dataset): Promise<DatasetSummary> {
    let summary = await (async () => {
      switch (dataset.type) {
        case "csv":
          let localDataset = await CSVBuilder(dataset)
          this._datasets[dataset.name] = localDataset
          return localDataset.summary()
      }
      throw Error(`We can't handle datasets of type ${dataset.type}.`)
    })()

    this._notify(dataset.name)
    return summary
  };

  async unregisterDataset(datasetName: string) {
    delete this._datasets[datasetName]
    delete this._notificationSubscriptions[datasetName]
  };

  async unregisterTransform(transform: DatasetTransform) {

  };

  async registerOrUpdateTransform(transform: DatasetTransform, onUpdated?: (transform: DatasetSummary) => void) {
    return {
      name: transform.name
    }
  };

  async registerDatasetQuery(query: DatasetQuery, onUpdate?: (result: QueryResult) => void): Promise<QueryResult> {
    const getMetric = async () => {
      let dataset = this._datasets[query.datasetName]
      if (dataset) {
        return await dataset.query(query)
      }
    };

    if (onUpdate) {
      this._registerNotifier(query.datasetName, async () => {
        let result = await getMetric()
        onUpdate(result)
      })
    }

    return getMetric()

  };
}

