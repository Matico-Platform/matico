import {ShapefileLoader} from '@loaders.gl/shapefile';

import {parse} from '@loaders.gl/core';
import shp from "shpjs"

export const getShpPreview = async (file:File) =>{
  const blob = await file.arrayBuffer();
  const data = await shp(blob);
  return { data : data.features.slice(0,10)} 
}
