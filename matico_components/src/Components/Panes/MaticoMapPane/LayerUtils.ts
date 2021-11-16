import {parseSync} from "@loaders.gl/core";
import {WKBLoader} from "@loaders.gl/wkt";
import wkx from 'wkx'

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

export function convertPoly(wkbGeom: any) {
  const geom: any = wkx.Geometry.parse(Buffer.from(wkbGeom));
  return [
    mapCoords(geom.polygons[0].exteriorRing),
    ...geom.polygons[0].interiorRings.map(mapCoords),
  ];
}

export function convertLine(wkbGeom: any) {
  return chunkCoords(parseSync(wkbGeom, WKBLoader).positions.value);
}

