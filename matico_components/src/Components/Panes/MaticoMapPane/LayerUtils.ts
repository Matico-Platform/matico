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
    const ramp = constructRampFunctionNum(range,domain);
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
    console.log("as array ", color)
    if(color.length===4){
      let c  = chroma(...color.slice(0,3), color[3]/255.0, "rgb").rgba()
      return c 
    }
    else{
    let c= chroma(...color,'rgb').rgba()
    if(alpha){ c[3] = 0.7} 
    return c 
    }
  }
  if (typeof color === "string") {
    if (chroma.valid(color)) {
      let c = chroma(color).rgba()
      if(alpha){ c[3] = 0.7} 
      return c
    }
  }
  return null;
};

const constructRampFunctionNum= (range:Array<any>,domain:Array<any> )=>{
      if(typeof(domain[0]) === 'string'){
        return (val:string)=> {
          return range[domain.indexOf(val)] ?? 20
        }
      }
      else{
        return d3.scaleLinear().domain(domain).range(range)
      }
  

}
const constructRampFunctionCol = (range:Array<any>,domain:Array<any> )=>{
      if(typeof(domain[0]) === 'string'){
        return (val:string)=> {
          console.log("domain ",domain ,val)
          const index = domain.indexOf(`${val}`)
        
          if(index >=0){
            const r = range[index]
            console.log("r is ",r, index, range )
            return chroma(r)
          } 
          else{
            return  chroma(211,211,211)
          }
        }
      }
      else{
        return chroma
        .scale(range)
        .domain(domain);
      }
  

}
export const generateColorVar = (colorVar, alpha=false): ColorReturn => {
  if (!colorVar) {
    return null;
  }
  // If the color is data driven we compute the ramp either
  // from an array of color values or a named pallet
  if (colorVar.variable) {
    const { variable, domain, range } = colorVar;

    console.log("variable domain range ", variable,domain, range )

    if (Array.isArray(range)) {
      const mappedRange = range.map((c) => generateColor(c,true))

      const ramp = constructRampFunctionCol(mappedRange,domain) 

      return (d) => {
        let c = ramp(d[variable]).rgba();
        c[3]= c[3]*255
        return c
      }
    } else if (typeof range === "string" && _.at(colors, range)[0]) {
      let brewer = _.at(colors, range)[0];
      if (!brewer) {
        return null;
      }

      if (!Array.isArray(brewer)) {
        brewer = brewer[3];
      }
      const ramp = constructRampFunctionCol(brewer.map((c) => generateColor(c,true)), domain)

      return (d: any) => {
        const val = d.hasOwnProperty("properties")
          ? d.properties[variable] 
          : d[variable];
        if(!val){ return [0,0,0,0]}
        console.log("test ",ramp,val)
        console.log("test2 ",ramp(val))
        let c = ramp(val).rgba();
        c[3]= c[3]*255
        return c
      };
    } else {
      return null;
    }
  }

  let c= generateColor(colorVar, alpha);
  c[3]= c[3]*255
  return c
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
