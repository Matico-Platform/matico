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
  Int32
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

        const lat_index = columns.map(c=>c.name).indexOf(lat_col)
        const lng_index = columns.map(c=>c.name).indexOf(lng_col)

        fields.push(new Field('geom', new Binary(),true));

        if(!this.id_col){
          fields.push(new Field('id', new Int32(),true));
        }

        const struct = new Struct(fields);
        const builder = Builder.new({
          type: struct,
          nullValues: [null, "n/a"],
        });

        let isHeader = true;
        let id = 0
        Papa.parse(url, {
          dynamicTyping: true,
          download: true,
          step: (row) => {
            if (!isHeader) {
              if(!row) return
              try {

                const lng = row.data[lng_index]
                const lat = row.data[lat_index]

                if(lng === undefined || lat=== undefined){
                 console.log("Bad lat lng ", lng,lat,row.data) 
                 return
                }

                const geom = new wkx.Point(lng,lat).toWkb();
                
                let datum = [...row.data, geom]

                if(!id_col){
                  datum.push(id) 
                  id++
                }
                console.log("fields size ", fields.length , " Datum size ", datum.length)

                //@ts-ignore
                builder.append(datum);
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
                id_col ? id_col : 'id',
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
