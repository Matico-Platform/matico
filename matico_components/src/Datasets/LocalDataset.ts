import {
  Dataset,
  Column,
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
    public idCol: string,
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

  getFeature(feature_id: string) {
    const selectPredicate = predicate.col(this.idCol).eq(feature_id);
    const results = this._getResultsFromPredicate(selectPredicate);
    return results;
  }

  getArrow() {
    return this._data.serialize();
  }

  getDataWithGeo(filters?: Array<Filter>) {
    return this.getData(filters);
  }

  _applyAggregateFunction(
    column: string,
    aggFunc: (agg: number, val: number) => number,
    filters?: Array<Filter>
  ) {
    let base = null;
    if (filters && filters.length) {
      const predicate = this._constructPredicate(filters);
      base = this._data.filter(predicate);
    } else {
      base = this._data;
    }
    let columnVals = [];
    let agg: number | null = null;
    base.scan(
      (index) => {
        agg = aggFunc(agg, columnVals[index]);
      },
      (batch) => {
        //@ts-ignore
        columnVals = predicate.col(column).bind(batch);
      }
    );
    return agg;
  }

  getColumnMax(column: string, filters?: Array<Filter>) {
    return this._applyAggregateFunction(column, (agg,val)=>
      val > agg ? val : agg
    , filters)
  }

  getColumnMin(column: string, filters?: Array<Filter>) {
    return this._applyAggregateFunction(column, (agg,val)=>
      val < agg ? val : agg
    , filters)
  }

  getColumnSum(column: string, filters?: Array<Filter>) {
    return this._applyAggregateFunction(column, (agg,val)=>
      agg+=val 
    , filters)
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

  _getResultsFromPredicate(filterPredicate: any, columns?: Array<string>) {
    const filterResults = this._data.filter(filterPredicate);

    try {
      const vars = {};
      let results = [];

      let selectColumns = columns ? columns : this.columns().map((c) => c.name);

      selectColumns = [...selectColumns, "geom"];

      filterResults.scan(
        (index) => {
          results.push(
            selectColumns.reduce((agg, col) => {
              return {
                ...agg,
                //@ts-ignore
                [col]: vars[col](index),
              };
            }, {})
          );
        },
        (batch) => {
          selectColumns.forEach((col) => {
            vars[col] = predicate.col(col).bind(batch);
          });
        }
      );
      return results;
    } catch {
      console.warn(
        "something went wrong applying filters cowardly returning empty array"
      );
      return [];
    }
  }

  getData(filters?: Array<Filter>, columns?: Array<string>) {
    console.log("filters are ", filters);
    const cacheKey = JSON.stringify([filters, columns]);
    if (this._filterCache[cacheKey]) {
      return this._filterCache[cacheKey];
    }
    if (filters && filters.length) {
      const predicate = this._constructPredicate(filters);
      const results = this._getResultsFromPredicate(predicate);

      this._filterCache[JSON.stringify(filters)] = results;
      return results;
    }
    return this._data.toArray();
  }
}
