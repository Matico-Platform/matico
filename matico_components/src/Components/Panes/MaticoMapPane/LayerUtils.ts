import { parseSync } from "@loaders.gl/core";
import { WKBLoader } from "@loaders.gl/wkt";
import wkx from "wkx";
import chroma from "chroma-js";
import { RGBAColor } from "@deck.gl/core";
import * as d3 from 'd3-scale'

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

export const generateNumericVar = (numericVar): NumberReturn=>{
  if(!numericVar) return null 
  if(typeof numericVar ==='number') return numericVar;
  if(numericVar.variable){
    const {variable,domain, range} =numericVar;
    const ramp = d3.scaleLinear().domain(domain).range(range);
    console.log("NUMERIC IS A THING ", variable, ramp)
    return (d)=>ramp(d[variable])
  }
}

export const generateColorVar = (colorVar): ColorReturn => {

  if(!colorVar){ return null}

  if (Array.isArray(colorVar)) {
    return colorVar as RGBAColor;
  }
  if (colorVar.variable) {
    console.log('colorVar is ',colorVar)
    const { variable, domain, range } = colorVar;
    const ramp = chroma
      .scale(range.map((c) => chroma.rgb(...c)))
      .domain(domain);

    return (d) => ramp(d[variable]).rgb();
  }
  return null;
};
