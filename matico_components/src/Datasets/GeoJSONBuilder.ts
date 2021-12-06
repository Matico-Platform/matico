import {
  Dataset,
  Column,
  Datum,
  GeomType,
  Filter,
  CategoryFilter,
  RangeFilter,
  DatasetState,
} from "./Dataset";
import { constructColumnListFromSample } from "./utils";
import {
  Binary,
  Field,
  Struct,
  Builder,
  Int32,
  Table,
  DataFrame,
} from "@apache-arrow/es5-cjs";
import traverse from "traverse";
import wkx from "wkx";
import { LocalDataset } from "./LocalDataset";
import { Int } from "@apache-arrow/es5-cjs/fb/Schema";

export class GeoJSONBuilder {
  private _isReady: boolean;
  private _columns: Array<Column>;
  private _geometryType: GeomType;
  private _data: DataFrame;

  constructor(
    public name: string,
    public url: string,
    onDone: (ld: LocalDataset) => void,
    public idCol?: string
  ) {
    this._isReady = false;
    fetch(url)
      .then((r) => r.json())
      .then((result: any) => {
        this._geometryType = this._extractGeomType(result);
        this._data = this._buildDataTable(result);
        onDone(
          new LocalDataset(
            name,
            idCol ? idCol : "id",
            this._columns,
            this._data,
            this._geometryType
          )
        );
      });
  }

  private _buildDataTable(geoJSON: any) {
    const props = geoJSON.features[0].properties;
    const { columns, fields } = constructColumnListFromSample(props);
    this._columns = columns;
    fields.push(new Field("geom", new Binary(), true));
    if (!this.idCol) {
      fields.push(new Field("id", new Int32(), false));
    }
    const struct = new Struct(fields);
    const builder = Builder.new({
      type: struct,
      nullValues: [null, "n/a"],
    });
    geoJSON.features.forEach((feature, id) => {
      const geom = wkx.Geometry.parseGeoJSON(feature.geometry).toWkb();
      //@ts-ignore
      const values = columns.map((c) => feature.properties[c.name]);
      let datum = [...values, geom];
      if (!this.idCol) {
        datum.push(id);
      }
      //@ts-ignore
      builder.append(datum);
    });
    builder.finish();
    return new DataFrame(Table.fromStruct(builder.toVector()));
  }

  private _extractGeomType(geojson: any) {
    const geomTypeCounts = traverse(geojson.features).reduce(function (
      agg,
      node
    ) {
      if (this.key === "geometry") {
        const geomType = node.type;
        agg[geomType] = agg[geomType] ? agg[geomType] + 1 : 0;
      }
      return agg;
    },
    {});

    const type = Object.entries(geomTypeCounts).reduce((max, pair) =>
      pair[1] > max[1] ? pair : max
    )[0];

    switch (type) {
      case "Polygon":
      case "MultiPolygon":
        return GeomType.Polygon;
      case "Point":
      case "MultiPoint":
        return GeomType.Point;
      case "MultiLineString":
      case "LineString":
        return GeomType.Line;
      default:
        throw Error(`unsupported geometry type ${type}`);
    }
  }

  private _extractColumns(result: any) {
    let a = traverse(result.features).reduce(function (acc, node) {
      if (this.key === "properties") {
        this.keys.forEach((k) => (acc[k] = { name: k, type: typeof k }));
      }
      return acc;
    }, {});
    let cols = Object.values(a) as Column[];
    if (this.idCol) {
      cols.push({ name: "id", type: "string" });
    }
    return cols;
  }

  isReady() {
    return this._isReady;
  }
}
