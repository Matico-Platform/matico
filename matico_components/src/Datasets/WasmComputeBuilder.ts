import {LocalDataset} from './LocalDataset'
import {Table,DataFrame} from "@apache-arrow/es5-cjs";
import {Column, Dataset, GeomType} from "./Dataset"

interface WasmComputeBuilderOptions {
  name: string;
  url:string;
  params: {[param:string]:any};
}

export const WasmComputeBuilder = async (details: WasmComputeBuilderOptions, datasets: Array<Dataset>) => {
  console.log("WASM COMPUTE BUILDER")
  const { name, url ,params } = details;
  console.log("Attempting to load wasm component from ", url)
  const wasm = await import(/* webpackIgnore: true */   url)
  
  console.log("got wasm component")

  await wasm.default();
  
  console.log("initalized wasm compute ")

  const key = Object.keys(wasm).find(k => k.includes("Interface"))

  console.log("analysis key is ",key)
  console.log("Parameters are ", JSON.stringify(params))
  const analysis = wasm[key].new()

  Object.entries(params).forEach(([name,val])=>{
    if(val.Table){
         console.log("attempting to register table", val.Table, JSON.stringify(Object.keys(datasets)))
         let dataset = datasets[val.Table];
         if(dataset){
           console.log("Registering table dataset ", JSON.stringify(dataset._data.serialize()) )
           try{
            analysis.register_table(name,dataset._data.serialize("binary",false))
            console.log("table registered")
           }
           catch(e){
              console.log("Table register error",JSON.stringify(e))
           }
         }
    }
    analysis.set_paramter(name,val)
  })

   

  console.log("constructed the instance")
  const run_result  = analysis.run();
  console.log("have run the instance")
  const table = Table.from([run_result])
  console.log("got table")
  const dataFrame = new DataFrame(table);
  console.log("adding dataframe")

  return new LocalDataset(
    details.name,
    "ogc_fid",
    [{name:"geom",type:"geometry"}],
    dataFrame,
    GeomType.Point,
  );
};

