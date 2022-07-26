import * as React from 'react';
import { CustomProjection, Graticule } from '@visx/geo';
import {
    geoConicConformal,
    geoTransverseMercator,
    geoNaturalEarth1,
    geoConicEquidistant,
    geoOrthographic,
    geoStereographic,
    geoMercator,
    geoEquirectangular
} from 'd3-geo';
import * as d3 from 'd3-geo';
import * as scale from '@visx/scale';
import { StaticMapSpec, ColorOutput, DataRow } from "../../types";


declare module 'react' {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}

export type ColorSpecification = { rgba: Array<number> } | { rgb: Array<number> } | { named: string } | { hex: string };


interface FeatureShape {
    type: 'Feature';
    id: string;
    geometry: { coordinates: [number, number][][]; type: 'Polygon' };
    properties: Record<string, any>;
}

const basicProjections: { [projection: string]: (() => d3.GeoProjection)} = {
    geoConicConformal,
    geoTransverseMercator,
    geoNaturalEarth1,
    geoConicEquidistant,
    geoOrthographic,
    geoStereographic,
    geoMercator,
    geoEquirectangular
}

function formatColor (color:ColorOutput) {
  if (typeof color == "string") {
    return color;
  } else if (Array.isArray(color)) {
    let prefix = color.length === 3 ? "rgb" : "rgba"
    return `${prefix}(${color.join(",")})`;
  }
}


export const StaticMapComponent:React.FC<StaticMapSpec> = ({data, proj, fill="white", background="white", gratOn=true, gratColor="black", strokeWidth=0.5, strokeColor="black", events=true}) => {
    if (data) {    
        let width = 500, height = 500;

        const projection = basicProjections[proj]()
        //@ts-ignore
        .fitExtent([[20, 20], [width - 20, height - 20]], {type: "FeatureCollection", features: data}); // Translate and scale to fit the object

        if (gratOn) { 
          // Calculate the graticule step size. It will always be 10 times a power of 2
          const nearestPow2 = Math.pow(2, Math.round(Math.log(360 / projection.scale()) / Math.log(2)))
          var stepSize = 10 * Math.min(nearestPow2, 1)

          // Calculate the extent of the graticule. These are the default variables
          var [[extMinLong, minorMinLat],[extMaxLong, minorMaxLat]] =  [[-180.01, -80.01], [180.01, 80.01]]
          var [majorMinLat, majorMaxLat] = [-90, 90]
        
          // Modify the extent of the graph if the step size is small to decrease the amount the app has to render
          if (stepSize <= 5) {
              // Get the lat/long coordinates of the corners of the graph
              const ul = projection.invert?.([0, 0])
              const bl = projection.invert?.([0, height])
              const ur = projection.invert?.([width, 0])
              const br = projection.invert?.([width, height])

              if (ul && bl) {
                 extMinLong = Math.max(extMinLong, Math.min(ul[0], bl[0]))
              }
              if (ur && br) {
                  extMaxLong = Math.min(extMaxLong, Math.max(ur[0], br[0]))
              }
              if (bl && br) {
                  minorMinLat = Math.max(minorMinLat, Math.min(bl[1], br[1]))
                  majorMinLat = Math.max(majorMinLat, Math.min(bl[1], br[1]))
              } 
              if (ul && ur) {
                  minorMaxLat = Math.min(minorMaxLat, Math.max(ul[1], ur[1]))
                  majorMaxLat = Math.min(majorMaxLat, Math.max(ul[1], ur[1]))
             }
          }
        }

        return (
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill={formatColor(background)} rx={0} />
                {!!data && (
                    <CustomProjection<FeatureShape>
                        projection={() => projection}
                        data={data as FeatureShape[]}
                        scale={projection.scale()}
                        translate={projection.translate()}
                    >
                        {(customProjection:any) => (
                            <g>
                                {gratOn ? <Graticule graticule={(g) => customProjection.path(g) || ''} stroke={formatColor(gratColor)} 
                                extentMinor={[[extMinLong, minorMinLat],[extMaxLong, minorMaxLat]]}
                                extentMajor={[[extMinLong, majorMinLat],[extMaxLong, majorMaxLat]]} 
                                stepMinor={[stepSize, stepSize]}/> : null }
                                {customProjection.features.map(({ feature, path }: any, i:number) => (
                                    <path
                                        key={`map-feature-${i}`}
                                        d={path || ''}
                                        fill={typeof fill == "function" ? formatColor(fill(feature.properties)) : formatColor(fill)}
                                        stroke={formatColor(strokeColor)}
                                        strokeWidth={strokeWidth}
                                        onClick={() => {
                                            if (events) console.log(`Clicked: ${feature.properties}`); 
                                        }}
                                    />
                                ))}
                            </g>
                        )}
                    </CustomProjection>
                )}
            </svg>
        )
    } else {
        return (
            <h1>Oops! Something's wrong.</h1>
        )
    }
};