import { Column, GeomType } from "./Dataset";
import { constructColumnListFromSample } from "./utils";
import wkx from "wkx";
import { LocalDataset } from "./LocalDataset";
import {
  Table,
  Builder,
  Struct,
  Binary,
  DataFrame,
  Field,
  Int32,
} from "@apache-arrow/es5-cjs";

import Papa from "papaparse";
interface CSVDetails {
  name: string;
  url: string;
  lat_col: string;
  lng_col: string;
  id_col: string;
}

const extractHeader = async (
  url: string,
  lat_col: string,
  lng_col: string,
  id_col: string
) => {
  return new Promise<{
    columns: Array<Column>;
    fields: any;
    lat_index: number;
    lng_index: number;
  }>((resolve, reject) => {
    Papa.parse(url, {
      preview: 1,
      dynamicTyping: true,
      header: true,
      download: true,
      complete: (results: any) => {
        const { columns, fields } = constructColumnListFromSample(
          results.data[0]
        );

        const lat_index = columns.map((c) => c.name).indexOf(lat_col);
        const lng_index = columns.map((c) => c.name).indexOf(lng_col);

        fields.push(new Field("geom", new Binary(), true));

        if (!id_col) {
          fields.push(new Field("id", new Int32(), true));
        }
        resolve({ columns, fields, lat_index, lng_index });
      },
    });
  });
};

const extractData = async (
  url: string,
  fields: any,
  lat_index: number,
  lng_index: number,
  id_col: string
) => {
  const struct = new Struct(fields);
  const builder = Builder.new({
    type: struct,
    nullValues: [null, "n/a"],
  });

  let id = 0;
  console.log("Extracting data ");
  return new Promise<DataFrame>((resolve, reject) => {
    console.log("In promise");
    Papa.parse(url, {
      dynamicTyping: true,
      download: true,
      header: true,
      complete: (results) => {
        console.log("Results ", JSON.stringify(results));
        results.data.forEach((row: any) => {
          if (!row) return;
          try {
            const lng = Object.values(row)[lng_index];
            const lat = Object.values(row)[lat_index];

            if (lng === undefined || lat === undefined) {
              console.log("Bad lat lng ", lng, lat, row);
              return;
            }

            const geom = new wkx.Point(lng, lat).toWkb();

            let datum = [...Object.values(row), geom];

            if (!id_col) {
              datum.push(id);
              id++;
            }
            //@ts-ignore
            builder.append(datum);
          } catch (e) {
            console.log("issue with datum ", JSON.stringify(row), e);
          }
        });
        builder.finish();
        resolve(new DataFrame(Table.fromStruct(builder.toVector())));
      },
    });
  });
};

const extractGeomType = (lat_col: string, lng_col: string) => {
  if (lat_col && lng_col) {
    return GeomType.Point;
  } else {
    return GeomType.None;
  }
};

export const CSVBuilder = async (details: CSVDetails) => {
  const { url, lat_col, lng_col, id_col, name } = details;
  const { columns, fields, lat_index, lng_index } = await extractHeader(
    url,
    lat_col,
    lng_col,
    id_col
  );

  const data = await extractData(url, fields, lat_index, lng_index, id_col);

  const geomType = extractGeomType(lat_col, lng_col);
  return new LocalDataset(
    name,
    id_col ? id_col : "id",
    columns,
    data,
    geomType
  );
};
