import { Column, GeomType } from "./Dataset";
import { constructColumnListFromTable } from "./utils";
import { LocalDataset } from "./LocalDataset";
import { loadArrow, escape} from "arquero";
import wkx from "wkx";
import {ArrowDataset} from "@maticoapp/matico_types/spec";

interface ArrowBuilder{
  name: string;
  url: string;
  geometryCol?:string;
  idCol?:string
}


export const ArrowBuilder= async (details: ArrowDataset) => {
  const { url, geometryCol, name } = details;
  const idCol: string | null = null

  //@ts-ignore
  let data= await loadArrow(url)

  let sampleGeom = data.column(geometryCol ?? "geometry").get(0)
  let geom = wkx.Geometry.parse(Buffer.from(sampleGeom))

  let geomType= GeomType.Polygon


  return new LocalDataset(
    name,
    idCol ? idCol : "id",
    constructColumnListFromTable(data),
    data,
    geomType
  );
};
