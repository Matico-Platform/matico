import { JSONLoader } from "@loaders.gl/json";
import { loadInBatches } from "@loaders.gl/core";

export const getJsonPreview = async (file: File) => {
  const data = await loadInBatches(file, JSONLoader, {
    json: { jsonpaths: [`$.features`] },
  });

  //Not sure why TS is mad at this Async Iterator deff has a next method
  //@ts-ignore
  let { value: result } = await data.next();

  // for await (const batch of data){
  //   result = batch
  //   break
  // }
  return result;
};
