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

export class GeoJSONDataset implements Dataset {
  private _isReady: boolean;
  //TODO find a way to make this a more general expression
  private _data: any;
  private _columns: Column[];
  private _geometryType;

  GeomType;

  constructor(
    public name: string,
    public url: string,
    onStateChange?: (state: DatasetState) => void
  ) {
    onStateChange(DatasetState.LOADING);
    this._isReady = false;
    fetch(url)
      .then((r) => r.json())
      .then((result: any) => {
        this._data = result;
        this._columns = this._extractColumns();
        this._geometryType = this._extractGeomType();
        this._isReady = true;
        onStateChange(DatasetState.READY);
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

  uniqueForColumn(columnName:string){
    if(!this._columns.map(c=>c.name).includes(columnName)){
      throw(Error(`No column of name ${columnName} in dataset ${self.name}`)) 
    }
    const unique = this._data.features.reduce( (agg,feature)=>  agg.add(feature[columnName]) , new Set<string>())
    return Array.from(unique) as Array<string> 
  }

  getData(filters?: Array<Filter>) {
    if (filters && filters.length) {
      const features = this._data.features.filter((feature) =>
        filters.every(
          (filter) =>
            (filter.min !== undefined
              ? feature.properties[filter.variable] >= filter.min
              : true) &&
            (filter.max !== undefined
              ? feature.properties[filter.variable] <= filter.max
              : true)
        )
      );
      return { ...this._data, features };
    } else {
      return this._data;
    }
  }
}
