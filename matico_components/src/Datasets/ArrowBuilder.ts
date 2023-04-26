import { Column, GeomType } from "./Dataset";
import { constructColumnListFromTable } from "./utils";
import { LocalDataset } from "./LocalDataset";
import { loadArrow, escape } from "arquero";
import wkx from "wkx";
import { ArrowDataset } from "@maticoapp/matico_types/spec";
import { ColumnType } from "arquero/dist/types/table/column";

interface ArrowBuilder {
  name: string;
  url: string;
  geometryCol?: string;
  idCol?: string;
}

export const getGeomType = (geomCol: ColumnType) => {
  let sampleGeom = geomCol.get(0);
  console.log("Sample geom ", sampleGeom);
  let geom = wkx.Geometry.parse(Buffer.from(sampleGeom));
  console.log("Sample geom ", geom);
  let geomType = null;

  console.log("Sample geom ", geom.toGeoJSON().type);
  //@ts-ignore
  switch (geom.toGeoJSON().type) {
    case "Point":
    case "MutliPoint":
      geomType = GeomType.Point;
      break;

    case "Line":
    case "LineString":
    case "MutliLine":
      geomType = GeomType.Line;
      break;

    case "Polygon":
    case "MultiPolygon":
      geomType = GeomType.Polygon;
      break;
  }
  return geomType;
};

export const ArrowBuilder = async (details: ArrowDataset) => {
  const { url, geometryCol, name } = details;
  const idCol: string | null = null;

  try {
    //@ts-ignore
    let data = await loadArrow(url);

    let geomColName =
      geometryCol ??
      data._names.find((n) =>
        ["geom", "geometry"].includes(n.toLowerCase())
      );

    let geomCol = data.column(geomColName);

    let geomType = geomCol ? getGeomType(geomCol) : null;

    if (geomCol) {
      data = data.rename({ [geomColName]: "geom" });
    }

    return new LocalDataset(
      name,
      idCol ? idCol : "id",
      constructColumnListFromTable(data),
      data,
      geomType
    );
  } catch (e) {
    debugger;
    throw e;
  }
};
