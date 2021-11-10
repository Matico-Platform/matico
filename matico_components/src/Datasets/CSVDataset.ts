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
  predicate,
  DataFrame,
} from "@apache-arrow/es5-cjs";

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
    const columns: Column[] = [];
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
            columns.push({ name, type: "string" });
          } else if ((value as number) % 1 === 0) {
            fields.push(new Field(name, new Int32(), true));
            columns.push({ name, type: "number" });
          } else {
            fields.push(new Field(name, new Float32(), true));
            columns.push({ name, type: "number" });
          }
        });
        this._columns = columns;

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
                builder.append(row.data);
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
            this._isReady = true;
            onStateChange(DatasetState.READY);
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

  getDataWithGeo(filters?: Array<Filter>) {
    return this._data.toArray();
  }

  getData(filters?: Array<Filter>) {
    if (filters && filters.length) {
      let filterState = null;
      filters.forEach((filterOuter) => {
        const [type, filter] = Object.entries(filterOuter)[0];
        switch (type) {
          case "Range":
            const rangeFilter = filter as RangeFilter;
            const { min, max, variable } = rangeFilter;
            if (min) {
              const mf = predicate.col(variable).gt(min);
              filterState = filterState ? filterState.and(mf) : mf;
            }
            if (max) {
              const mf = predicate.col(variable).lt(max);
              filterState = filterState ? filterState.and(mf) : mf;
            }
          case "Category":
          default:
            return;
        }
      });

      const vars = {}
      let results = [];

      const filterResults = this._data.filter(filterState);

      filterResults.scan(
        (index) => {
          results.push(
            Object.entries(vars).reduce((agg, [name, values]) => { 
              return {
              ...agg,
              //@ts-ignore
              [name]: values(index),
            }}),
            {}
          );
        },
        (batch) => {
          this.columns().forEach((col) => {
            vars[col.name] = predicate.col(col.name).bind(batch);
          });
        }
      );

      return results;
    }
    return this._data.toArray();
  }
}
