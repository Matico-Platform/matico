import {Dataset} from "Datasets/Dataset"
type Loader= (params:any)=> Dataset

export interface DatasetServiceInterface{
  testFunc: ()=>Promise<string>;
  slowFunc: ()=>Promise<number>;
  datasets: Array<Dataset>;
  datasetLoaders: Array<Loader>;
}


export const DatasetService: DatasetServiceInterface ={  
  datasets :[],
  datasetLoaders: [],

  async testFunc(): Promise<string>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>resolve("worked"),1000)
    })
  },

  async slowFunc(): Promise<number>{
    const fibonacci = (num: number): number => {
      if (num <= 1) return 1;

      return fibonacci(num - 1) + fibonacci(num - 2);
    }
    return fibonacci(200)

  }
}


