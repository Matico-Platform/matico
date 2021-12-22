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

interface GeoJSONBuilderOptions {
  name: string;
  url?: string;
  idCol: string;
}

export const GeoJSONBuilder = async (details: GeoJSONBuilderOptions) => {
  const { name, url, idCol } = details;
  const result = await fetch(url).then((r) => r.json());
  const geometryType = extractGeomType(result);
  const { columns, fields } = extractColumns(result, idCol);
  const data = buildDataTable(result, idCol, columns, fields);
  return new LocalDataset(
    name,
    idCol ? idCol : "id",
    columns,
    data,
    geometryType
  );
};

const extractColumns = (geoJSON: any, idCol: string) => {
  const props = geoJSON.features[0].properties;
  const { columns, fields } = constructColumnListFromSample(props);
  fields.push(new Field("geom", new Binary(), true));
  if (!idCol) {
    fields.push(new Field("id", new Int32(), false));
  }
  return { columns, fields };
};
const buildDataTable = (
  geoJSON: any,
  idCol: string | null,
  columns: Array<Column>,
  fields: any
) => {
  const struct = new Struct(fields);
  const builder = Builder.new({
    type: struct,
    nullValues: [null, "n/a"],
  });
  geoJSON.features.forEach((feature: any, id: number) => {
    const geom = wkx.Geometry.parseGeoJSON(feature.geometry).toWkb();
    //@ts-ignore
    const values = columns.map((c) => feature.properties[c.name]);
    let datum = [...values, geom];
    if (!idCol) {
      datum.push(id);
    }
    //@ts-ignore
    builder.append(datum);
  });
  builder.finish();
  return new DataFrame(Table.fromStruct(builder.toVector()));
};

const extractGeomType = (geojson: any) => {
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
};
