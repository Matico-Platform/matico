import { parseSync } from "@loaders.gl/core";
import { WKBLoader } from "@loaders.gl/wkt";
import wkx from "wkx";
import chroma from "chroma-js";
import { RGBAColor } from "@deck.gl/core";
import * as d3 from "d3-scale";
import { colors } from "../../../Utils/colors";
import lodash from "lodash";

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
  return parseSync(wkbGeom, WKBLoader).positions.value;
}

export function convertPoly(poly: any) {
  return [mapCoords(poly.exteriorRing), ...poly.interiorRings.map(mapCoords)];
}

export function expandMultiAndConvertPoly(data: any) {
  const result = data.map((d) => ({
    ...d,
    geom: wkx.Geometry.parse(Buffer.from(d.geom)),
  }));
  const expanded = result.reduce((agg, d) => {
    if (d.geom.polygons) {
      d.geom.polygons.forEach((poly) => {
        agg.push({ ...d, geom: convertPoly(poly) });
      });
    } else {
      agg.push({ ...d, geom: convertPoly(d.geom) });
    }
    return agg;
  }, []);

  return expanded;
}

export function convertLine(wkbGeom: any) {
  return chunkCoords(parseSync(wkbGeom, WKBLoader).positions.value);
}

type ColorReturn = RGBAColor | ((d: unknown) => RGBAColor);
type NumberReturn = number | ((d: unknown) => number);

export const generateNumericVar = (numericVar): NumberReturn => {
  if (!numericVar) return null;
  if (typeof numericVar === "number") return numericVar;
  if (numericVar.variable) {
    const { variable, domain, range } = numericVar;
    const ramp = d3.scaleLinear().domain(domain).range(range);
    return (d) => {
      const val = d.hasOwnProperty("properties")
        ? d.properties[variable]
        : d[variable];
      return ramp(val);
    };
  }
  return null;
};

export const generateColor = (color: any, alpha: boolean) => {
  if (Array.isArray(color)) {
    const chromaColor = chroma.rgb(...color).rgb()
    return alpha ? [...chromaColor, color[3]||255] : chromaColor
  }
  if (typeof color === "string") {
    if (chroma.valid(color)) {
      return chroma(color).rgb();
    }
  }
  return null;
};

export const generateColorVar = (colorVar, alpha=false): ColorReturn => {
  if (!colorVar) {
    return null;
  }
  // If the color is data driven we compute the ramp either
  // from an array of color values or a named pallet
  if (colorVar.variable) {
    const { variable, domain, range } = colorVar;

    if (Array.isArray(range)) {
      const ramp = chroma
        .scale(range.map((c) => generateColor(c)))
        .domain(domain);
      return (d) => ramp(d[variable]).rgb();
    } else if (typeof range === "string" && _.at(colors, range)[0]) {
      let brewer = _.at(colors, range)[0];
      if (!brewer) {
        return null;
      }

      if (!Array.isArray(brewer)) {
        brewer = brewer[3];
      }

      const ramp = chroma
        .scale(brewer.map((c) => generateColor(c)))
        .domain(domain);
      return (d: any) => {
        const val = d.hasOwnProperty("properties")
          ? d.properties[variable]
          : d[variable];
        return ramp(val).rgb();
      };
    } else {
      return null;
    }
  }

  return generateColor(colorVar, alpha);
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
