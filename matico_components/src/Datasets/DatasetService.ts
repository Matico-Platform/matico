import {Dataset} from "Datasets/Dataset"
import {CSVBuilder} from "./CSVBuilder";
import {GeoJSONBuilder} from "./GeoJSONBuilder";
type Loader= (params:any)=> Dataset

export interface DatasetServiceInterface{
  datasets: {[datasetName : string] : Dataset},
  datasetLoaders:  {[loaderName: string] : Loader},
  registerDataset: (datasetName:string, datasetDetails:any)=>Promise<{datasetName:string, state:any}>

}


export const DatasetService: DatasetServiceInterface ={  
  datasets :{},
  datasetLoaders: {},

  async registerDataset(datasetName:string, datasetDetails: any): Promise<{datasetName:string, state:any}>{

      switch(datasetDetails.type){
        case "GeoJSON":
          this.datasets[datasetName] = await GeoJSONBuilder(datasetDetails)
          return {datasetName, state:"LOADED"}
        case "CSV":
          this.datasets[datasetName] = await CSVBuilder(datasetDetails)
          return {datasetName, state:"LOADED"}
      }
  }
}


