import { Dataset, Column, Datum, GeomType, DatasetState } from "./Dataset";
import { constructColumnListFromTable} from "./utils";
import wkx from "wkx";
import { LocalDataset } from "./LocalDataset";
import { GeoJSONDataset } from "@maticoapp/matico_types/spec";
import { fromJSON, fromArrow} from "arquero";
import { makeBuilder, Binary, tableFromArrays} from "@apache-arrow/es5-cjs";
import traverse from "traverse";

export const GeoJSONBuilder = async (details: GeoJSONDataset) => {
    const { name, url } = details;
    const idCol: null | string = null;

    const data = await fetch(url).then((r)=>r.json())
    const properties = data.features.map((feature:any)=> feature.properties)

    const result = fromJSON(properties)

    const geometryType = extractGeomType(data);
    const geomBuilder = makeBuilder({
        type: new Binary(),
        nullValues: [null]
    });

    data.features.forEach((feature: any, id: number) => {
        if (!feature.geometry) {
            geomBuilder.append(null);
        }
        else{
          const geom = wkx.Geometry.parseGeoJSON(feature.geometry).toWkb();
          geomBuilder.append(geom)
        }
    });

    const geoms = geomBuilder.finish().toVector();

    debugger
    let geom_table = fromArrow(tableFromArrays({"geoms":geoms.toArray()}))
    

    result.assign(geom_table)

    
    const columns = constructColumnListFromTable(result);
    return new LocalDataset(
        name,
        idCol ? idCol : "id",
        columns,
        result,
        geometryType
    );
};

const extractGeomType = (geojson: any) => {
    const geomTypeCounts = traverse(geojson.features).reduce(function (
        agg,
        node
    ) {
        if (this.key === "geometry" && node) {
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
