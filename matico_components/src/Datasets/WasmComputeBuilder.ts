import {LocalDataset} from './LocalDataset'
import { Dataset, GeomType} from "./Dataset"
import {WASMCompute, ParameterValue, SpecParameter} from "@maticoapp/matico_types/spec"
import {fromArrow} from 'arquero'
import {DataType} from '@apache-arrow/es5-cjs'


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
            analysis.register_table(name,dataset._data.serialize("binary",false))
          }
    }
    // else if(parameter.type==='optionGroup'){
    //   let mappedParameter  = parameter.value.reduce((agg: Record<string,ParameterValue>,val: SpecParameter)=>({...agg,[val.name]:val.parameter}), {});
    //   console.log("mapped parameter", parameter, name, params, mappedParameter )
    //   try{
    //     analysis.set_parameter(name,{type:"optionGroup",value:mappedParameter})
    //   catch{
    //     console.log("ERROR HAPPENED WHILE SETTING PARAMETER GROUP")
    //   }
    // }
    else{
      try{
        analysis.set_parameter(name,parameter)
      }
      catch{
        console.log("FAILED TO REGISTER ",name,parameter)
      }
    }
  })

  console.log("All variables set without issue")

  const run_result  = analysis.run();
  console.log("Analysis run")
  let dataFrame = fromArrow(run_result)
  
  const fields  = dataFrame.toArrow().schema.fields.map((f)=>  ({ name: f.name, type: arrowTypeToMaticoType(f.type)} ) )
  return new LocalDataset(
    details.name,
    "ogc_fid",
    fields,
    dataFrame,
    GeomType.Point,
  );
};
