import { Column, GeomType } from "./Dataset";
import { constructColumnListFromTable } from "./utils";
import { LocalDataset } from "./LocalDataset";
import { loadCSV} from "arquero";

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
  console.log("HERE IN CSV BUILDER")
  const { url, latCol, lngCol,  name } = details;
  const idCol: string | null = null
  // const { columns, fields, lat_index, lng_index } = await extractHeader(
  //   url,
  //   latCol,
  //   lngCol,
  //   idCol
  // );

  // const data = await extractData(url, fields, lat_index, lng_index, idCol);
  // 
  //
  let table = await loadCSV(url,{})
  let geomType = extractGeomType(latCol,lngCol)

  return new LocalDataset(
    name,
    idCol ? idCol : "id",
    constructColumnListFromTable(table),
    table,
    geomType
  );
};
