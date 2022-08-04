import { Column, GeomType } from "./Dataset";
import { constructColumnListFromTable } from "./utils";
import { LocalDataset } from "./LocalDataset";
import { loadCSV, escape} from "arquero";
import wkx from "wkx";


import {CSVDataset} from "@maticoapp/matico_types/spec";
interface CSVDetails {
  name: string;
  url: string;
  lat_col: string;
  lng_col: string;
  id_col: string;
}


const extractGeomType = (latCol: string, lngCol: string) => {
  if (latCol && lngCol) {
    return GeomType.Point;
  } else {
    return GeomType.None;
  }
};

export const CSVBuilder = async (details: CSVDataset) => {
  const { url, latCol, lngCol,  name } = details;
  const idCol: string | null = null

  let data= await loadCSV(url,{})
  let geomType = extractGeomType(latCol,lngCol)


  let geoms = data.select({[latCol] : 'lat', [lngCol]:"lng"}).derive({
    geom:escape((d)=>{
      return new wkx.Point(d.lng,d.lat).toWkb()
    })
  })
  
  data= data.assign(geoms.select("geom"))

  return new LocalDataset(
    name,
    idCol ? idCol : "id",
    constructColumnListFromTable(data),
    data,
    geomType
  );
};
