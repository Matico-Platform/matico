import { fromCSV, escape } from "arquero";
import ColumnTable from "arquero/dist/types/table/column-table";
import { useState } from "react";
import wkx from "wkx";

export const useCSVConvert = async (file: File) => {
  const [data, setData] = useState<ColumnTable | null>(null);
  const { latCol, lngCol } = params;
  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    if (event.target) {
      const csv = event.target.result;
      let table = fromCSV(csv as string, {});
      setData(table);
    }
  });

  reader.readAsText(file);

  // let geomType = extractGeomType(latCol,lngCol)

  return { data };
};

export const assignGeomCols = (
  table: ColumnTable,
  latCol: string,
  lngCol: string
) => {
  let geoms = table.select({ [latCol]: "lat", [lngCol]: "lng" }).derive({
    geom: escape((d: { lat: number; lng: number }) => {
      return new wkx.Point(d.lng, d.lat).toWkb();
    }),
  });

  table = table.assign(geoms.select("geom"));
  return table;
};
