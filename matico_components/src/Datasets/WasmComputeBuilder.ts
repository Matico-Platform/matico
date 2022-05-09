import {LocalDataset} from './LocalDataset'
import {Table,DataFrame} from "@apache-arrow/es5-cjs";
import {Column, Dataset, GeomType} from "./Dataset"
import {DataType} from '@apache-arrow/es5-cjs'

interface WasmComputeBuilderOptions {
  name: string;
  url:string;
  params: {[param:string]:any};
}


const arrowTypeToMaticoType= (aType: DataType)=>{
  if(DataType.isInt(aType)|| DataType.isFloat(aType) ||DataType.isDecimal(aType)){
    return "number"
  }
  if(DataType.isBinary(aType)){
    return "geometry"
  }
  if(DataType.isUtf8(aType)){
    return "text"
  }
  return "unknown"
}

export const WasmComputeBuilder = async (details: WasmComputeBuilderOptions, datasets: Array<Dataset>) => {
  const { name, url ,params } = details;
  const wasm = await import(/* webpackIgnore: true */   url)
  await wasm.default();
  const key = Object.keys(wasm).find(k => k.includes("Interface"))
  const analysis = wasm[key].new()

  Object.entries(params).forEach(([name,val])=>{
    if(val.Table){
         let dataset = datasets[val.Table];
         if(dataset){
           try{
            analysis.register_table(name,dataset._data.serialize("binary",false))
           }
           catch(e){
              console.log("Table register error",JSON.stringify(e))
           } }
    }
    analysis.set_parameter(name,val)
  })

   

  const run_result  = analysis.run();
  const table = Table.from([run_result])
  const dataFrame = new DataFrame(table);
  
  console.log("dataFrame fields are ", dataFrame.schema.fields)
  const fields  = dataFrame.schema.fields.map((f)=>  ({ name: f.name, type: arrowTypeToMaticoType(f.type)} ) )
  return new LocalDataset(
    details.name,
    "ogc_fid",
    fields,
    dataFrame,
    GeomType.Point,
  );
};
