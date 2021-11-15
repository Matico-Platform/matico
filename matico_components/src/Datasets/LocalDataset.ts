import {
  Dataset,
  Column,
  Datum,
  GeomType,
  Filter,
  RangeFilter,
  DatasetState,
} from "./Dataset";

import { predicate, DataFrame } from "@apache-arrow/es5-cjs";

export class LocalDataset implements Dataset {
  private _isReady: boolean;
  //TODO find a way to make this a more general expression
  private _filterCache: any;

  constructor(
    public name: string,
    private _columns: Array<Column>,
    public _data: DataFrame,
    public _geometryType: GeomType,
    onStateChange?: (state: DatasetState) => void
  ) {
    this._isReady = true;
    this._filterCache = [];
  }

  isReady() {
    return this._isReady;
  }

  local() {
    return true;
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
    return this.getData(filters);
  }

  _constructPredicate(filters?: Array<Filter>) {
    let combinedPredicate = null;
    let columnNames = this._columns.map((c) => c.name);
    filters.forEach((filterOuter) => {
      const [type, filter] = Object.entries(filterOuter)[0];
      if (!columnNames.includes(filter.variable)) {
        return;
      }
      switch (type) {
        case "Range":
          const rangeFilter = filter as RangeFilter;
          const { min, max, variable } = rangeFilter;
          if (min) {
            const mf = predicate.col(variable).gt(min);
            combinedPredicate = combinedPredicate
              ? combinedPredicate.and(mf)
              : mf;
          }
          if (max) {
            const mf = predicate.col(variable).lt(max);
            combinedPredicate = combinedPredicate
              ? combinedPredicate.and(mf)
              : mf;
          }
        case "Category":
        default:
          return;
      }
    });
    return combinedPredicate;
  }

  getData(filters?: Array<Filter>, columns?: Array<string>) {
    const cacheKey = JSON.stringify([filters, columns]);
    if (this._filterCache[cacheKey]) {
      console.log("USING cahced filter ")
      return this._filterCache[cacheKey];
    }
    if (filters && filters.length) {
      console.log("USING computed filter ")
      const predicate = this._constructPredicate(filters);
      const vars = {};
      let results = [];

      const filterResults = this._data.filter(predicate);
      let selectColumns = columns ? columns : this.columns().map((c) => c.name);

      selectColumns = [...selectColumns, "geom"];

      filterResults.scan(
        (index) => {
          results.push(
            Object.entries(vars).reduce((agg, [name, values]) => {
              return {
                ...agg,
                //@ts-ignore
                [name]: values(index),
              };
            }),
            {}
          );
        },
        (batch) => {
          selectColumns.forEach((col) => {
            vars[col] = predicate.col(col).bind(batch);
          });
        }
      );

      this._filterCache[JSON.stringify(filters)] = results;

      return results;
    }
    return this._data.toArray();
  }
}
