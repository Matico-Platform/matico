import {LocalDataset} from './LocalDataset'
import {Table,DataFrame} from "@apache-arrow/es5-cjs";
import {Column, GeomType} from "./Dataset"

interface WasmComputeBuilderOptions {
  name: string;
  url:string;
  params: {[param:string]:any};
}

export const WasmComputeBuilder = async (details: WasmComputeBuilderOptions) => {
  console.log("WASM COMPUTE BUILDER")
  const { name, url ,params } = details;
  console.log("Attempting to load wasm component from ", url)
  const wasm = await import(/* webpackIgnore: true */   url)
  
  console.log("got wasm component")

  await wasm.default();
  
  console.log("initalized wasm compute ")

  const key = Object.keys(wasm).find(k => k.includes("Interface"))

  console.log("analysis key is ",key)

  const analysis = wasm[key].new()

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

