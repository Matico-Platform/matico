import { parseSync } from "@loaders.gl/core";
import { WKBLoader } from "@loaders.gl/wkt";
import wkx from "wkx";
import chroma, { Color } from "chroma-js";
import { at } from "lodash";
import { RGBAColor } from "@deck.gl/core";
import * as d3 from "d3-scale";
import { colors } from "../../../Utils/colors";
import { ColorSpecification, MappingVarOr } from "@maticoapp/matico_types/spec";
import { Polygon, MultiPolygon } from "wkx";

export function chunkCoords(coords: Array<Number>) {
    return coords.reduce((result, coord, index) => {
        const i = Math.floor(index / 2);
        const j = index % 2;
        result[i] = result[i] ? result[i] : [];
        result[i][j] = coord;
        return result;
    }, []);
}

// Simple convenience function to take a 1D array of coords and make it 2D
export function mapCoords(array: Array<{ x: number; y: number }>) {
    return array.map((a) => [a.x, a.y]);
}

export function convertPoint(wkbGeom: any) {
    if (!wkbGeom) return null;
    let wkxVal = wkx.Geometry.parse(Buffer.from(wkbGeom));
    //@ts-ignore
    return [wkxVal.x, wkxVal.y];
}

export function convertPoly(poly: Polygon) {
    return [mapCoords(poly.exteriorRing), ...poly.interiorRings.map(mapCoords)];
}

export function expandMultiAndConvertPoly(data: Array<Record<string, any>>) {
    const result = data.map(
        (d: Record<string, any> & { geom: Uint8Array }) => ({
            ...d,
            geom: d.geom ? wkx.Geometry.parse(Buffer.from(d.geom)) : null
        })
    );
    const expanded = result.reduce(
        (
            agg: Array<Record<string, any> & { geom: number[][][] }>,
            d: Record<string, any> & { geom: Polygon | MultiPolygon }
        ) => {
            if ("polygons" in d.geom) {
                d.geom.polygons.forEach((poly: Polygon) => {
                    agg.push({ ...d, geom: convertPoly(poly) });
                });
            } else {
                agg.push({ ...d, geom: convertPoly(d.geom) });
            }
            return agg;
        },
        []
    );

    return expanded;
}

export function convertLine(wkbGeom: any) {
    return chunkCoords(parseSync(wkbGeom, WKBLoader).positions.value);
}

type ColorReturn =
    | ColorSpecification
    | RGBAColor
    | ((d: Record<string, unknown>) => RGBAColor);
type NumberReturn = number | ((d: Record<string, unknown>) => number);

export const chromaColorFromColorSpecification = (
    color: ColorSpecification,
    alpha: boolean
) => {
    if ("rgba" in color) {
        return chroma(
            color.rgba[0],
            color.rgba[1],
            color.rgba[2],
            color.rgba[3] / 255.0,
            "rgb"
        );
    } else if ("rgb" in color) {
        return chroma(
            color.rgb[0],
            color.rgb[1],
            color.rgb[2],
            alpha ? 0.7 : 1,
            "rgb"
        );
    } else if ("hex" in color) {
        return chroma.hex(color.hex);
    } else if ("named" in color) {
        return chroma.hex(color.named);
    }
    return null;
};

export const generateNumericVar = (
    numericVar: MappingVarOr<number>
): NumberReturn => {
    if (!numericVar) return null;
    if (typeof numericVar === "number") return numericVar;
    if ("variable" in numericVar) {
        const { variable, domain, range } = numericVar;

        if ("varId" in domain.values || "dataset" in domain.values) {
            return null;
        }

        const ramp =
            domain.type === "continuious" &&
            typeof domain.values[0] === "number"
                ? constructRampFunctionNum(
                      range.values as Array<number>,
                      domain.values
                  )
                : constructCageoryFuncNum(range.values, domain.values, 0);

        return (d: Record<string, unknown>) => {
            const val =
                //@ts-ignore
                "properties" in d ? d.properties[variable] : d[variable];
            return ramp(val) as number;
        };
    }
    return null;
};

const constructCageoryFuncNum = <T>(
    range: Array<number>,
    domain: Array<T>,
    defaultVal: number
) => {
    return (d: T) => {
        let index = domain.indexOf(d);
        if (index >= 0 && index < range.length) {
            return range[index];
        }
        return defaultVal;
    };
};

const constructRampFunctionNum = (
    range: Array<number>,
    domain: Array<number>
) => {
    return d3.scaleLinear().domain(domain).range(range);
};

const constructRampFunctionCol = (
    range: Array<Color>,
    domain: Array<number>
): ((d: number) => Color) => {
    return chroma.scale(range).domain(domain);
};

const constructCategoryFunctionCol = <T>(
    range: Array<Color>,
    domain: Array<T>
): ((d: T) => Color) => {
    return (d: T) => {
        let defaultColor = chroma.css("lightgrey");
        let index = domain.indexOf(d);
        if (index >= 0 && index < range.length) {
            return range[index];
        }
        return defaultColor;
    };
};

export const getColorPallet = (name: string) => {
    let pallet: Array<any> | Record<string | number, any> = at(colors, name)[0];
    if (!Array.isArray(pallet)) {
        pallet = pallet[3];
    }
    return pallet.map((c: string | Array<number>) => {
        if (typeof c === "string") {
            return { hex: c };
        } else if (Array.isArray(c)) {
            return c.length === 3 ? { rgb: c } : { rgba: c };
        }
    });
};
export const getColorPalletChroma = (name: string) => {
    let pallet = getColorPallet(name);
    return pallet.map((c: ColorSpecification) =>
        chromaColorFromColorSpecification(c, true)
    );
};
export const generateColorVar = (
    colorVar: MappingVarOr<ColorSpecification>,
    alpha = false
): ColorReturn => {
    if (!colorVar) {
        return null;
    }
    // If the color is data driven we compute the ramp either
    // from an array of color values or a named pallet
    if ("variable" in colorVar) {
        const { variable, domain, range } = colorVar;

        let colorBuckets: Array<Color> | undefined = undefined;

        let rangeAssignType = range.type;

        if (Array.isArray(range.values)) {
            colorBuckets = range.values.map((c) =>
                chromaColorFromColorSpecification(c, true)
            );
        } else if (typeof range.values === "string") {
            colorBuckets = getColorPalletChroma(range.values);
        }

        if (!Array.isArray(domain.values)) {
            return null;
        }

        //@ts-ignore
        const ramp =
            domain.type === "continuious"
                ? constructRampFunctionCol(colorBuckets, domain.values)
                : constructCategoryFunctionCol(colorBuckets, domain.values);

        return (d: Record<string, any>) => {
            let c = ramp(d[variable]).rgba();
            c[3] = c[3] * 255;
            return c;
        };
    }
};

export const parentContainsClassName = (
    el: HTMLElement,
    className: string
): boolean => {
    if (el?.classList?.contains(className)) {
        return true;
    }
    if (el?.parentElement) {
        return parentContainsClassName(el.parentElement, className);
    }
    return false;
};
