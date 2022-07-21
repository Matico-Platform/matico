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
  const wasm = await import(/* webpackIgnore: true */   url)
  await wasm.default();
  const key = Object.keys(wasm).find(k => k.includes("Interface"))
  const analysis = wasm[key].new()
  console.log(details)

  params.forEach(({name,parameter})=>{
    console.log("registering variable ",name ,JSON.stringify(parameter))
    if(parameter.type ==='table'){
         let dataset = datasets.find(d=>d.name === parameter.value);
         alert("Here!")
         if(dataset){
           try{
            analysis.register_table(name,dataset._data.serialize("binary",false))
           }
           catch(e){
              console.log("Table register error",JSON.stringify(e))
           } }
    }

    analysis.set_parameter(name,parameter)
  })

  console.log("All variables set without issue")

  const run_result  = analysis.run();
  console.log("Analysis run")
  let table;
  let dataFrame
  table = Table.from([run_result])
  dataFrame = new DataFrame(table);
  
  const fields  = dataFrame.schema.fields.map((f)=>  ({ name: f.name, type: arrowTypeToMaticoType(f.type)} ) )
  return new LocalDataset(
    details.name,
    "ogc_fid",
    fields,
    dataFrame,
    GeomType.Point,
  );
};
