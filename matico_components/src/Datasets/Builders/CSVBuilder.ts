import { GeomType } from "Datasets/Dataset";
import { constructColumnListFromTable } from "Datasets/utils";
import { LocalDataset } from "Datasets/LocalDataset";
import { loadCSV, escape } from "arquero";
import wkx from "wkx";
import { CSVDataset } from "@maticoapp/matico_types/spec";

const extractGeomType = (latCol: string, lngCol: string) => {
  if (latCol && lngCol) {
    return GeomType.Point;
  } else {
    return GeomType.None;
  }
};

export const CSVBuilder = async (details: CSVDataset) => {
  const { url, latCol, lngCol, name } = details;
  const idCol: string | null = null;

  let data = await loadCSV(url, {});
  let columns = constructColumnListFromTable(data)
  let geomType = extractGeomType(latCol, lngCol);

  let foundLatCol = columns.find(c => c.name === latCol)
  let foundLngCol = columns.find(c => c.name === lngCol)

  if (geomType !== GeomType.None) {

    if (!foundLatCol) { throw Error(`CSV file does not contain specified lat col: ${latCol}`) }
    if (!foundLngCol) { throw Error(`CSV file does not contain specified lng col: ${lngCol}`) }
    if (foundLatCol.type !== 'number') { throw Error(`lat column :${latCol} is not of type number`) }
    if (foundLngCol.type !== 'number') { throw Error(`lng column :${lngCol} is not of type number`) }

    let geoms = data.select({ [latCol]: "lat", [lngCol]: "lng" }).derive({
      geom: escape((d: { lat: number, lng: number }) => {
        return new wkx.Point(d.lng, d.lat).toWkb();
      })
    });

    data = data.assign(geoms.select("geom"));
    columns.push({ name: "geom", type: "geometry" })
  }

  return new LocalDataset(
    name,
    idCol ? idCol : "id",
    columns,
    data,
    geomType
  );
};
