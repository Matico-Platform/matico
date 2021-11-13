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
} from "@apache-arrow/es5-cjs";

import Papa from "papaparse";

export class CSVBuilder {
  private _isReady: boolean;
  //TODO find a way to make this a more general expression
  private _data: any;
  private _columns: Column[];
  private _geometryType;
  private _filterCache: any;
  GeomType;

  constructor(
    public name: string,
    public url: string,
    onDone: (LocalDataset) => void,
    public lat_col?: string,
    public lng_col?: string,
    public id_col?: string
  ) {
    Papa.parse(url, {
      preview: 1,
      dynamicTyping: true,
      header: true,
      download: true,
      complete: (results) => {
        const { columns, fields } = constructColumnListFromSample(
          results.data[0]
        );
        this._columns = columns;

        fields.push(new Binary());

        const struct = new Struct(fields);
        const builder = Builder.new({
          type: struct,
          nullValues: [null, "n/a"],
        });

        let isHeader = true;
        Papa.parse(url, {
          dynamicTyping: true,
          download: true,
          step: (row) => {
            if (!isHeader) {
              try {
                const geom = new wkx.Point(row[lng_col], row[lat_col]).toWkb();
                //@ts-ignore
                builder.append([...row.data, geom]);
              } catch (e) {
                console.log("issue with datum ", row.data, e);
              }
            } else {
              isHeader = false;
            }
          },
          complete: () => {
            builder.finish();
            this._data = new DataFrame(Table.fromStruct(builder.toVector()));
            onDone(
              new LocalDataset(
                name,
                columns,
                this._data,
                this._extractGeomType()
              )
            );
          },
        });
      },
    });
  }

  private _extractGeomType() {
    if (this.lat_col && this.lng_col) {
      return GeomType.Point;
    } else {
      return GeomType.None;
    }
  }
}
