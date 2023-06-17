import { parseSync } from "@loaders.gl/core";
import { WKBLoader } from "@loaders.gl/wkt";
import wkx from "wkx";
import chroma from "chroma-js";
import * as d3 from "d3-scale";
import { Color as DeckColor } from "@deck.gl/core/typed"
import {
    ColorSpecification,
    MappingVarOr,
    Range,
    DomainVal
} from "@maticoapp/matico_types/spec";
import { Polygon, MultiPolygon } from "wkx";
import { colors } from "Utils/colors";

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

type ColorReturn = DeckColor | ((d: Record<string, unknown>) => DeckColor);
type NumberReturn = number | ((d: Record<string, unknown>) => number);

export const generateNumericVar = (
    numericVar: MappingVarOr<number>
): NumberReturn => {
    if (!numericVar) return null;
    if (typeof numericVar === "number") return numericVar;
    if ("variable" in numericVar) {
        const { variable, domain, range } = numericVar;
        const ramp = constructRampFunctionNum(
            range as Range<number>,
            domain as DomainVal[]
        );
        return (d: Record<string, unknown>) => {
            const val =
                //@ts-ignore
                "properties" in d ? d.properties[variable] : d[variable];
            return ramp(val) as number;
        };
    }
    return null;
};

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

const constructRampFunctionNum = (
    range: Range<number>,
    domain: DomainVal[]
) => {
    if (typeof domain[0] === "string") {
        return (val: string) => {
            return range[domain.indexOf(val)] ?? 20;
        };
    } else {
        return d3
            .scaleLinear()
            .domain(domain as number[])
            .range(range as number[]);
    }
};
const constructRampFunctionCol = (range: Range<number>, domain: Array<any>) => {
    if (typeof domain[0] === "string") {
        return (val: string) => {
            const index = domain.indexOf(`${val}`);

            if (index >= 0) {
                const r = range[index];
                return chroma(r);
            } else {
                return chroma(211, 211, 211);
            }
        };
    } else {
        return chroma.scale(range).domain(domain);
    }
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

        if (Array.isArray(range)) {
            const mappedRange = range.map((c) =>
                chromaColorFromColorSpecification(c, true)
            );

            const ramp = constructRampFunctionCol(mappedRange, domain);

            return (d) => {
                let c = ramp(d[variable]).rgba();
                c[3] = c[3] * 255;
                return c;
            };
        } else if (typeof range === "string" && _.at(colors, range)[0]) {
            let brewer = _.at(colors, range)[0];
            if (!brewer) {
                return null;
            }

            if (!Array.isArray(brewer)) {
                brewer = brewer[3];
            }

            const mappedRange = brewer.map((c: string | Array[number]) =>
                chromaColorFromColorSpecification(
                    typeof c === "string" ? { hex: c } : { rgb: c },
                    true
                )
            );

            const ramp = constructRampFunctionCol(mappedRange, domain);

            return (d: any) => {
                let val;
                if (typeof d === "number") {
                    val = d;
                } else {
                    val = d.hasOwnProperty("properties")
                        ? d.properties[variable]
                        : d[variable];
                }
                if (!val) {
                    return [0, 0, 0, 0];
                }
                let c = ramp(val).rgba();

                return c;
            };
        } else {
            return null;
        }
    }

    let c = chromaColorFromColorSpecification(colorVar, alpha).rgba();
    c[3] = c[3] * 255;
    return () => c;
};

export const getColorScale = (range: any) => {
    if (typeof range === "string") {
        let brewer = _.at(colors, [range]);
        if (!brewer) {
            return null;
        }
        return brewer;
    } else {
        return range;
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
