import { Column, GeomType } from "./Dataset";
import { constructColumnListFromTable } from "./utils";
import { LocalDataset } from "./LocalDataset";
import { loadArrow, escape } from "arquero";
import wkx from "wkx";
import { ArrowDataset } from "@maticoapp/matico_types/spec";
import { ColumnType } from "arquero/dist/types/table/column";

interface ArrowBuilder {
    name: string;
    url: string;
    geometryCol?: string;
    idCol?: string;
}

export const getGeomType = (geomCol: ColumnType) => {
    let sampleGeom = geomCol.get(0);
    let geom = wkx.Geometry.parse(Buffer.from(sampleGeom));
    let geomType = null;

    //@ts-ignore
    switch (geom.toGeoJSON().type) {
        case "Point":
        case "MutliPoint":
            geomType = GeomType.Point;
            break;

        case "Line":
        case "MutliLine":
            geomType = GeomType.Line;

        case "Polygon":
        case "MultiPolygon":
            geomType = GeomType.Polygon;
    }
    return geomType;
};

export const ArrowBuilder = async (details: ArrowDataset) => {
    const { url, geometryCol, name } = details;
    const idCol: string | null = null;

    try {
        //@ts-ignore
        let data = await loadArrow(url);
        let geomCol = data.column(geometryCol ?? "geom");

        let geomType = geomCol ? getGeomType(geomCol) : null;

        return new LocalDataset(
            name,
            idCol ? idCol : "id",
            constructColumnListFromTable(data),
            data,
            geomType
        );
    } catch (e) {
        debugger;
        throw e;
    }
};
