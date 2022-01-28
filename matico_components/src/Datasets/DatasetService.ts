import {
  Dataset,
  Column,
  GeomType,
  DatasetSummary,
  DatasetState,
  Filter,
} from "Datasets/Dataset";
import { CSVBuilder } from "./CSVBuilder";
import { GeoJSONBuilder } from "./GeoJSONBuilder";
type Loader = (params: any) => Dataset;


export interface DatasetServiceInterface {
  datasets: { [datasetName: string]: Dataset };
  datasetLoaders: { [loaderName: string]: Loader };
  getData(datasetName:string, filters?:Array<Filter>, includeGeo?:boolean);
  registerDataset: (
    datasetName: string,
    datasetDetails: any
  ) => Promise<DatasetSummary>;
}

export const DatasetService: DatasetServiceInterface = {
  datasets: {},
  datasetLoaders: {},

  async getData(datasetName: string, filters?: Array<Filter>, includeGeo?: boolean ){
      return []
     // try{
     // let d = this.datasets[datasetName]
     // let data = includeGeo ? d.getDataWithGeo(filters) : d.getData(filters)  
     // return data
     // }
     // catch{
     //    return null
     // }
  },

  async registerDataset(datasetDetails: any): Promise<DatasetSummary> {
    switch (datasetDetails.type) {
      case "GeoJSON":
        const geoDataset = await GeoJSONBuilder(datasetDetails);
        return {
          name: geoDataset.name,
          state: DatasetState.READY,
          columns: await geoDataset.columns(),
          geomType: await geoDataset.geometryType(),
          local: true,
        };
      case "CSV":
        const csvDataset = await CSVBuilder(datasetDetails);
        return {
          name: csvDataset.name,
          state: DatasetState.READY,
          columns: await geoDataset.columns(),
          geomType: await geoDataset.geometryType(),
          local: true,
        };
    }
  },
};
