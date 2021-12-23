import { Dataset } from "Datasets/Dataset";
import { CSVBuilder } from "./CSVBuilder";
import { GeoJSONBuilder } from "./GeoJSONBuilder";
type Loader = (params: any) => Dataset;

export interface DatasetServiceInterface {
  datasets: { [datasetName: string]: Dataset };
  datasetLoaders: { [loaderName: string]: Loader };
  registerDataset: (
    datasetName: string,
    datasetDetails: any
  ) => Promise<{ datasetName: string; state: any }>;
}

export const DatasetService: DatasetServiceInterface = {
  datasets: {},
  datasetLoaders: {},

  async registerDataset(
    datasetDetails: any
  ): Promise<{ datasetName: string; state: any }> {
    console.log("Registering dataset inside worker ", datasetDetails);

    switch (datasetDetails.type) {
      case "GeoJSON":
        this.datasets[datasetDetails.name] = await GeoJSONBuilder(
          datasetDetails
        );
        console.log("Building geojson file");
        return { datasetName: "test", state: {} };
      //
      //         return {datasetName: datasetDetails.datasetName, state:"LOADED"}
      //       case "CSV":
      //         this.datasets[datasetDetails.datasetName] = await CSVBuilder(datasetDetails)
      //         return {datasetName: datasetDetails.datasetName, state:"LOADED"}
    }
  },
};
