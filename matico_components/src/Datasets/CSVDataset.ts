import {
  Dataset,
  Column,
  Datum,
  GeomType,
  Filter,
  RangeFilter,
  DatasetState,
} from "./Dataset";

import traverse from "traverse";

import {
  Table,
  Field,
  Utf8,
  Int32,
  Float32,
  Struct,
  Builder,
} from '@apache-arrow/es5-cjs'

import Papa from "papaparse";

export class CSVDataset implements Dataset {
  private _isReady: boolean;
  //TODO find a way to make this a more general expression
  private _data: any;
  private _columns: Column[];
  private _geometryType;
  GeomType;

  constructor(
    public name: string,
    public url: string,
    public lat_col?: string,
    public lng_col?: string,
    public id_col?: string,
    onStateChange?: (state: DatasetState) => void
  ) {
    this._isReady = false;
    onStateChange(DatasetState.LOADING);
    const columns : Column[] = [];
    Papa.parse(url, {
      preview: 1,
      dynamicTyping: true,
      header: true,
      download: true,
      complete: (results) => {
        const fields = [];
        Object.entries(results.data[0]).forEach(([name, value]) => {
          let field = null;
          if (typeof value === "string") {
            fields.push(new Field(name, new Utf8(), true));
            columns.push({name, type:"string"})
          } else if ((value as number) % 1 === 0) {
            fields.push(new Field(name, new Int32(), true));
            columns.push({name, type:"number"})
          } else {
            fields.push(new Field(name, new Float32(), true));
            columns.push({name, type:"number"})
          }
        });
        this._columns = columns

        const struct = new Struct(fields);
        const builder = Builder.new({ type: struct ,  nullValues: [null, 'n/a'] });

        let isHeader = true 
        Papa.parse(url, {
          dynamicTyping: true,
          download: true,
          step: (row) => {
            if (!isHeader){
              try{
               builder.append(row.data);
              }
              catch(e){
                console.log("issue with datum ", row.data, e)
              }
            }
            else{
              isHeader = false
            }
          },
          complete: () => {
            builder.finish();
            this._data = Table.fromStruct(builder.toVector());
            this._isReady = true
            onStateChange(DatasetState.READY)
          },
        });
      },
    });
  }

  private _extractGeomType() {
    return GeomType.Point;
  }

  private _extractColumns() {
    let a = traverse(this._data.features).reduce(function (acc, node) {
      if (this.key === "properties") {
        this.keys.forEach((k) => (acc[k] = { name: k, type: typeof k }));
      }
      return acc;
    }, {});
    return Object.values(a) as Column[];
  }

  isReady() {
    return this._isReady;
  }

  tiled() {
    return false;
  }

  geometryType() {
    return this._geometryType;
  }

  columns() {
    return this._columns;
  }

  getDataWithGeo(filters?: Array<Filter>){
    return this._data.toArray();
  }

  getData(filters?: Array<Filter>) {
    return this._data.toArray();
  }

}
