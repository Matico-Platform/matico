import { fromCSV, escape, fromJSON, fromArrow } from "arquero";
import ColumnTable from "arquero/dist/types/table/column-table";
import { makeBuilder, Binary, Table, tableToIPC } from "apache-arrow";
import { useEffect, useState } from "react";
import wkx from "wkx";

const fileType = (file: File) => {
  if (file.type.length) {
    switch (file.type) {
      case "application/csv":
      case "text/csv":
        return "csv";
      case "application/geo+json":
      case "application/json":
        return "geojson";
      case "application/zip":
        return "shp";
    }
  } else if (file.name.length) {
    const fileType = file.name.split(".").slice(-1)[0].toLowerCase();
    switch (fileType) {
      case "csv":
        return "csv";
      case "geojson":
      case "json":
        return "geojson";
      case "zip":
        return "shp";
    }
  } else {
    return null;
  }
};

export const useLoadDataset = (
  file: File | null,
  latCol?: string,
  lngCol?: string
) => {
  const [rawData, setRawData] = useState<ColumnTable | null>(null);
  const [data, setData] = useState<ColumnTable | null>(null);
  const [fType, setFType] = useState<"csv" | "geojson" | null>(null);
  useEffect(() => {
    if (file) {
      const fType = fileType(file);
      if (fType === "csv") {
        loadCSV(file).then((table: ColumnTable) => setRawData(table));
        setFType("csv");
      }
      if (fType === "geojson") {
        loadGeoJSON(file).then((table: ColumnTable) => setRawData(table));
        setFType("geojson");
      }
    }
  }, [file]);

  useEffect(() => {
    if (fType === "csv" && latCol && lngCol && rawData) {
      setData(assignGeomColsFromLatLng(rawData, latCol, lngCol))
    }
    else {
      setData(rawData)
    }
  }, [rawData, latCol, lngCol, fType])

  return {
    data,
    fileType: fType,
  };
};

export const assignGeomColsFromLatLng = (
  table: ColumnTable,
  latCol: string,
  lngCol: string
) => {
  console.log("Assigning lat lng column ");
  let geoms = table.select({ [latCol]: "lat", [lngCol]: "lng" }).derive({
    geom: escape((d: { lat: number; lng: number }) => {
      return new wkx.Point(d.lng, d.lat).toWkb();
    }),
  });

  table = table.assign(geoms.select("geom"));
  return table;
};

const loadCSV = async (file: File) => {
  return new Promise<ColumnTable>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      if (event.target) {
        const csv = event.target.result;
        let table = fromCSV(csv as string, {});
        resolve(table);
      }
    });

    reader.readAsText(file);
  });
};

const loadGeoJSON = async (file: File) => {
  return new Promise<ColumnTable>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      if (event.target) {
        let data = JSON.parse(event.target.result as string);
        const properties = data.features.map(
          (feature: any) => feature.properties
        );

        let keySet = new Set<string>();

        //@ts-ignore
        data.features.forEach((f) =>
          Object.keys(f.properties).forEach((k) => keySet.add(k))
        );

        let prop_array: Record<string, Array<any>> = Array.from(keySet).reduce(
          (agg, key) => ({ ...agg, [key]: [] }),
          {}
        );

        //@ts-ignore

        properties.forEach((feature: Record<string, any>) => {
          for (let key of Object.keys(prop_array)) {
            prop_array[key].push(feature[key]);
          }
        });

        let builder = makeBuilder({
          type: new Binary(),
          nullValues: [null],
        });

        data.features.forEach((f, i) => {
          builder.append(
            f.geometry ? wkx.Geometry.parseGeoJSON(f.geometry).toWkb() : null
          );
        });

        let geoms_columns = builder.finish().toVector();
        let geoms_arrow = new Table({ geom: geoms_columns });
        let geoms = fromArrow(tableToIPC(geoms_arrow));
        let result = fromJSON(prop_array);
        result = result.assign(geoms);
        resolve(result);
      }
    });

    reader.readAsText(file);
  });
};
