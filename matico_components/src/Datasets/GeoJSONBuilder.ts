import {  GeomType } from "./Dataset";
import { constructColumnListFromTable} from "./utils";
import wkx from "wkx";
import { LocalDataset } from "./LocalDataset";
import { GeoJSONDataset } from "@maticoapp/matico_types/spec";
import { fromJSON, fromArrow } from "arquero";
import { makeBuilder, Binary, Table,  tableToIPC} from "@apache-arrow/es5-cjs";
import traverse from "traverse";

export const GeoJSONBuilder = async (details: GeoJSONDataset) => {
    const { name, url } = details;
    const idCol: null | string = null;

    const data = await fetch(url).then((r)=>r.json())
    const properties = data.features.map((feature:any)=> feature.properties)

    let keySet = new Set<string>()

    //@ts-ignore
    data.features.forEach(f =>  Object.keys(f.properties).forEach(k => keySet.add(k)))

    let prop_array: Record<string, Array<any>> = Array.from(keySet).reduce( (agg,key)=> ({...agg, [key]: []}), {})

    //@ts-ignore
    
  
    properties.forEach((feature: Record<string,any>)=> {
      for (let key of Object.keys(prop_array)){
        prop_array[key].push(feature[key] )
      }
    })

   let builder = makeBuilder({
      type: new Binary(),
      nullValues: [null]
   }) 

    data.features.forEach((f,i)=>{ 
        builder.append(f.geometry ? wkx.Geometry.parseGeoJSON(f.geometry).toWkb() :null)
    })

    let geoms_columns = builder.finish().toVector()
    let geoms_arrow = new Table({"geom":geoms_columns})
    let geoms = fromArrow(tableToIPC(geoms_arrow))
    let result = fromJSON(prop_array)
    result = result.assign(geoms)

    const geometryType = extractGeomType(data);

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

