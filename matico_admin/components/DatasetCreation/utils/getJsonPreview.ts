import {JSONLoader} from '@loaders.gl/json';
import {loadInBatches} from '@loaders.gl/core';

export const getJsonPreview = async (file:File) =>{
  const data = await loadInBatches(file, JSONLoader, {json:{jsonpaths:[`$.features`]}}) 

  for await (const batch of data){
    console.log("batch is bach ", batch)
    break
  }

}
