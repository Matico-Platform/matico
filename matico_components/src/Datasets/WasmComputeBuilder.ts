import {LocalDataset} from './LocalDataset'
import {Table,DataFrame} from "@apache-arrow/es5-cjs";
import {Column, Dataset, GeomType} from "./Dataset"
import {DataType} from '@apache-arrow/es5-cjs'
import {WASMCompute} from "@maticoapp/matico_types/spec"


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

export const WasmComputeBuilder = async (details: WASMCompute, datasets: Array<Dataset>) => {
  const { name, url ,params } = details;
  console.log("loading compute file")
  const wasm = await import(/* webpackIgnore: true */   url)
  console.log("Awiting compute file")
  await wasm.default();
  const key = Object.keys(wasm).find(k => k.includes("Interface"))
  console.log("loading key ",key)
  const analysis = wasm[key].new()

  console.log("Setting parameters")
  Object.entries(params).forEach(([name,val])=>{
    console.log("registering variable ",name ,JSON.stringify(val))
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

    try{
      analysis.set_parameter(name,val)
    }
    catch(e){
        console.log("Variables register error ", JSON.stringify(e))
    }
  })

  console.log("Running Analysis")
  const run_result  = analysis.run();
  console.log("Analysis done generating table")
  const table = Table.from([run_result])
  console.log("building dataframe")
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
