import {
  Dataset,
  Column,
  GeomType,
  DatasetSummary,
  DatasetState,
} from "Datasets/Dataset";
import { CSVBuilder } from "./CSVBuilder";
import { GeoJSONBuilder } from "./GeoJSONBuilder";
type Loader = (params: any) => Dataset;


export interface DatasetServiceInterface {
  datasets: { [datasetName: string]: Dataset };
  datasetLoaders: { [loaderName: string]: Loader };
  registerDataset: (
    datasetName: string,
    datasetDetails: any
  ) => Promise<DatasetSummary>;
}

export const DatasetService: DatasetServiceInterface = {
  datasets: {},
  datasetLoaders: {},

  async registerDataset(datasetDetails: any): Promise<DatasetSummary> {
    switch (datasetDetails.type) {
      case "GeoJSON":
        const geoDataset = await GeoJSONBuilder(datasetDetails);
        return {
          name: geoDataset.name,
          state: DatasetState.READY,
          columns: geoDataset.columns(),
          local: true,
          geomType: geoDataset.geometryType(),
        };
      case "CSV":
        const csvDataset = await CSVBuilder(datasetDetails);
        return {
          name: csvDataset.name,
          state: DatasetState.READY,
          columns: csvDataset.columns(),
          local: true,
          geomType: csvDataset.geometryType(),
        };
    }
  },
};
