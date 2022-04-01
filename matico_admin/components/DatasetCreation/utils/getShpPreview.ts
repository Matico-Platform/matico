import * as zip from "@zip.js/zip.js"
import {DBFLoader} from '@loaders.gl/shapefile';
import {parseInBatches} from '@loaders.gl/core';

async function getDBFPreview(data: Blob){
  let reader = await parseInBatches(data,DBFLoader );
  //@ts-ignore
  let isHeader = true;
  //@ts-ignore
  let header = await reader.next()
  //@ts-ignore
  let batch = await reader.next()
  return batch.value
}

export async function getShpPreview(file:File) {
  const zipfile = 
    new zip.ZipReader(
      new zip.BlobReader(file)
    );
  const entries =  await zipfile.getEntries();

  for (const entry of entries){
    if( entry.filename.split(".").pop()==='dbf'){
      //@ts-ignore
      const data = await entry.getData(new zip.BlobWriter()) 
      const firstBatch = await getDBFPreview(data)    
      return firstBatch 
    }
  }

}

