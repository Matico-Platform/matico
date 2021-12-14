import {Dataset} from "Datasets/Dataset"
type Loader= (params:any)=> Dataset

export class DatasetService{  
  private datasets: Array<Dataset>=[];
  private datasetLoaders: Array<Loader>[];

  async testFunc(): Promise<string>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>resolve("worked"),1000)
    })
  }
}
