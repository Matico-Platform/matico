import {
  Dataset,
  Column,
  GeomType,
  DatasetSummary,
  DatasetState,
  Filter,
} from "Datasets/Dataset";
import { ColumnStatRequest } from "Stores/MaticoDatasetSlice";
import { CSVBuilder } from "./CSVBuilder";
import { GeoJSONBuilder } from "./GeoJSONBuilder";
import { COGBuilder } from "./COGBuilder";
import { MaticoRemoteBuilder } from "./MaticoRemoteBuilder";
import {MaticoRemoteApiBuilder} from "./MaticoRemoteApiBuilder";
import {WasmComputeBuilder} from "./WasmComputeBuilder";
type Loader = (params: any) => Dataset;

type Notifier = (datasetName: string) => void;

export interface DatasetServiceInterface {
  datasets: { [datasetName: string]: Dataset };
  datasetLoaders: { [loaderName: string]: Loader };
  notifiers: { [datasetName: string]: Record<string, Notifier>  };
  _notify: (datasetName: string) => void;
  _registerNotifier: (datasetName: string, notifierId: string, notifier: Notifier) => void;
  registerForUpdates(
    datasetName: string,
    callback: (data: Array<any>) => void,
    notifierId:string,
    filters?: Array<Filter>,
    includeGeo?: boolean
  ): void;
  registerDataset(
    datasetName: string,
    datasetDetails: any
  ): Promise<DatasetSummary>;

  registerColumnData(
    args: ColumnStatRequest,
    callback: (data: any) => void
  ): void;
}

export const DatasetService: DatasetServiceInterface = {
  datasets: {},
  datasetLoaders: {},
  notifiers: {},

  async registerColumnData(
    args: ColumnStatRequest,
    notifierId: string,
    callback: (data: any) => void,
  ) {

    const { datasetName, metric, column, parameters, filters } = args;
    
    const getMetric = async (datasetName: string) => {
      let dataset = this.datasets[datasetName];
      if (dataset) {
        switch (metric) {
          case "Max":
            return await dataset.getColumnMax(column);
          case "Min":
            return dataset.getColumnMin(column);
          case "EqualInterval":
            return dataset.getEqualIntervalBins(column, parameters.bins);
          case "Quantile":
            return dataset.getQuantileBins(column, parameters.bins);
          case "Histogram":
            return dataset.getColumnHistogram(column, parameters.bins,filters);
          case "CategoryCounts":
            return dataset.getCategoryCounts(column, filters)
          case "Categories":
            return dataset.getCategories(column,parameters.no_categories, filters)
          default:
            return null;
        }
      } else {
        return null;
      }
    };

    const metricVal = await getMetric(datasetName);
    if (metricVal) {
      callback(metricVal);
    }

    this._registerNotifier(datasetName, notifierId, async () => {
      const metricVal = await getMetric(datasetName);
      if (metricVal) {
        callback(metricVal);
      }
    },);
  },
  registerForUpdates(
    datasetName: string,
    callback: (data: Array<any>) => void,
    notifierId: string,
    filters?: Array<Filter>,
    includeGeo?: boolean,
  ) {

    this._registerNotifier(datasetName,notifierId, async (datasetName: string) => {
      let d = this.datasets[datasetName];
      
      if (d) {
        let data = includeGeo
          ? await d.getDataWithGeo(filters)
          : await d.getData(filters);
        callback(data);
      }

    });

    this._notify(datasetName);
  },

  _registerNotifier(
    datasetName: string,
    notifierId: string,
    callback: (datasetName: string) => void,
  ) {
    if (datasetName in this.notifiers) {
      this.notifiers[datasetName][notifierId] = callback;
    } else {
      this.notifiers[datasetName] = {
        [notifierId] : callback 
      };
    }
    
  },
  _notify(datasetName: string) {
    if (datasetName in this.notifiers) {
      Object.keys(this.notifiers[datasetName]).forEach((notifierID) => {
        this.notifiers[datasetName][notifierID](datasetName);
      });
    }
  },

  async registerDataset(datasetDetails: any): Promise<DatasetSummary> {
    switch (datasetDetails.type) {
      case "GeoJSON":
        const geoDataset = await GeoJSONBuilder(datasetDetails);
        this.datasets[geoDataset.name] = geoDataset;
        this._notify(geoDataset.name);
        return {
          name: geoDataset.name,
          state: DatasetState.READY,
          columns: await geoDataset.columns(),
          geomType: await geoDataset.geometryType(),
          local: true,
          raster:false,
          tiled: geoDataset.tiled(),
        };
      case "CSV":
        const csvDataset = await CSVBuilder(datasetDetails);
        this.datasets[csvDataset.name] = csvDataset;
        this._notify(csvDataset.name);
        return {
          name: csvDataset.name,
          state: DatasetState.READY,
          columns: await csvDataset.columns(),
          geomType: await csvDataset.geometryType(),
          raster:false,
          local: true,
          tiled: csvDataset.tiled(),
        };
      case "MaticoRemote":
        const maticoDataset = await MaticoRemoteBuilder(datasetDetails);
        this.datasets[maticoDataset.name] = maticoDataset;
        this._notify(maticoDataset.name);
        return {
          name: maticoDataset.name,
          state: DatasetState.READY,
          columns: await maticoDataset.columns(),
          geomType: await maticoDataset.geometryType(),
          local: false,
          tiled: maticoDataset.tiled(),
          raster:false,
          mvtUrl: maticoDataset.mvtUrl(),
        };
      case "MaticoApi":
        const maticoApi= await MaticoRemoteApiBuilder(datasetDetails);
        this.datasets[maticoApi.name] = maticoApi;
        this._notify(maticoApi.name);
        return {
          name: maticoApi.name,
          state: DatasetState.READY,
          columns: await maticoApi.columns(),
          geomType: await maticoApi.geometryType(),
          local: false,
          raster:false,
          tiled: maticoApi.tiled(),
          mvtUrl: maticoApi.mvtUrl(),
        };
      case "WASMCompute":
        const wasmCompute = await WasmComputeBuilder(datasetDetails, this.datasets);
        console.log("build local dataset from wasm")
        this.datasets[wasmCompute.name] = wasmCompute;
        this._notify(wasmCompute.name);
        return {
          name: wasmCompute.name,
          state: DatasetState.READY,
          columns: await wasmCompute.columns(),
          geomType: await wasmCompute.geometryType(),
          local: true,
          raster:false,
          tiled: wasmCompute.tiled(),
          mvtUrl: null,
        };
      case "COG":
        const cog = await COGBuilder(datasetDetails);
        this.datasets[cog.name] = cog;
        this._notify(cog.name);
        return {
          name: cog.name,
          state: DatasetState.READY,
          columns: await cog.columns(),
          geomType: await cog.geometryType(),
          local: false,
          raster: true,
          tiled: cog.tiled(),
          mvtUrl: cog.mvtUrl(),
        };
    }
  },
};
