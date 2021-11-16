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

export function convertPoly(poly: any) {
  return [
    mapCoords(poly.exteriorRing),
    ...poly.interiorRings.map(mapCoords),
  ];
}

export function expandMultiAndConvertPoly(data:any){
  const result = data.map(d=> ({...d, geom:wkx.Geometry.parse(Buffer.from(d.geom))})) 
  const expanded = result.reduce((agg,d)=>{
    d.geom.polygons.forEach((poly)=>{
      agg.push({...d, geom: convertPoly(poly)})
    }) 
    return agg 
  },[])

  return expanded
}

export function convertLine(wkbGeom: any) {
  return chunkCoords(parseSync(wkbGeom, WKBLoader).positions.value);
}

