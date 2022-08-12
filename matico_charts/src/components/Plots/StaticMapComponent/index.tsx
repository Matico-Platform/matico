import * as React from "react";
import { CustomProjection, Graticule } from "@visx/geo";
import {
  geoMercator,
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
  geoEquirectangular,
} from "d3-geo";
import * as d3 from "d3-geo";
import * as scale from "@visx/scale";
import {
  StaticMapSpec,
  ColorOutput,
  DataRow,
  PlotLayersProperties,
} from "../../types";
import { sanitizeColor } from "../../../Utils";
import { GridRows } from "@visx/grid";

declare module "react" {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

export type ColorSpecification =
  | { rgba: Array<number> }
  | { rgb: Array<number> }
  | { named: string }
  | { hex: string };

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: GeoJSON.GeometryObject; //{ coordinates: [number, number][][]; type: 'Polygon' };
  properties: Record<string, any>;
}

const basicProjections: { [projection: string]: () => d3.GeoProjection } = {
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
  geoMercator,
  geoEquirectangular,
};

// Alternate function to sanitizeColor
// function formatColor(color: ColorOutput) {
//   if (typeof color == "string") {
//     return color;
//   } else if (Array.isArray(color)) {
//     let prefix = color.length === 3 ? "rgb" : "rgba";
//     return `${prefix}(${color.join(",")})`;
//   }
// }

export const StaticMapComponent: React.FC<
  StaticMapSpec & PlotLayersProperties
> = ({
  xMax,
  yMax,
  data,
  proj = "geoMercator",
  fill = "white",
  //background="white",
  gratOn = true,
  gratColor = "black",
  strokeWidth = 0.5,
  rotation,
  strokeColor = "black",
  pointRadius = 3,
  events = true,
}) => {
  // Checkers for geometry and properties
  const geometryChecker = (row: any) => {
    return row.hasOwnProperty("geometry");
  }; // This one works, but removing properties for one of the rows will raise a different error on its own

  const propChecker = (row: any) => {
    return row.hasOwnProperty("properties");
  };

  console.log("Data is ",data)

  if (
    data &&
    data.every(geometryChecker) &&
    data.every(propChecker) &&
    proj in basicProjections
  ) {

    //@ts-ignore
    let [[left, bottom], [right, top]] = d3.geoBounds({
        type: "FeatureCollection",
        features: data,
      });
    
    const projection = basicProjections[proj]()
    .rotate([rotation !== undefined ? rotation : (left + right) / 2, 0, 0])
      //@ts-ignore
      .fitExtent(
        [
          [20, 20],
          [xMax - 20, yMax - 20],
        ],
        { type: "FeatureCollection", features: data }
      ) // Translate and scale to fit the object
      .clipExtent([
        [0, 0],
        [xMax, yMax],
      ]);

    if (gratOn) {
      // Calculate the graticule step size. It will always be 10 times a power of 2
      const nearestPow2 = Math.pow(
        2,
        Math.round(Math.log(360 / projection.scale()) / Math.log(2))
      );
      var stepSize = 10 * Math.min(nearestPow2, 1);

      // Calculate the extent of the graticule. These are the default variables
      var [[extMinLong, minorMinLat], [extMaxLong, minorMaxLat]] = [
        [-180.01, -80.01],
        [180.01, 80.01],
      ];
      var [majorMinLat, majorMaxLat] = [-90, 90];

      // Modify the extent of the graticule if the step size is small to decrease the amount the app has to render
      if (stepSize < 1.25) {
        // Get the lat/long coordinates of the corners and edge midpoints of the graph
        let corners = [
          projection.invert?.([0, 0]), //ul
          projection.invert?.([0, yMax / 2]),
          projection.invert?.([0, yMax]), //bl
          projection.invert?.([xMax / 2, yMax]),
          projection.invert?.([xMax, yMax]), //br
          projection.invert?.([xMax, yMax / 2]),
          projection.invert?.([xMax, 0]), // ur
          projection.invert?.([xMax / 2, 0]),
        ].filter((x) => x != null && typeof x != "undefined") as [
          number,
          number
        ][];

        const longs = corners.map((x: [number, number]) => x[0]);
        const lats = corners.map((x: [number, number]) => x[1]);

        if (left > -175) {
          extMinLong = Math.max(extMinLong, Math.min(...longs));
        } else {
          extMaxLong = Math.min(
            extMaxLong,
            Math.min(...longs.filter((x) => x < 0))
          );
        }

        if (right < 175) {
          extMaxLong = Math.min(extMaxLong, Math.max(...longs, right));
        } else {
          extMinLong = Math.max(
            extMinLong,
            Math.min(...longs.filter((x) => x > 0))
          );
        }

        minorMinLat = Math.max(minorMinLat, Math.min(...lats));
        majorMinLat = Math.max(majorMinLat, Math.min(...lats));

        minorMaxLat = Math.min(minorMaxLat, Math.max(...lats));
        majorMaxLat = Math.min(majorMaxLat, Math.max(...lats));
      }
    }

    return (
      <svg width={xMax} height={yMax}>
        {/* <rect x={0} y={0} width={xMax} height={yMax} fill={formatColor(background)} rx={0} /> */}
        {!!data && (
          <CustomProjection<FeatureShape>
            projection={() => projection}
            data={data as FeatureShape[]}
            scale={projection.scale()}
            translate={projection.translate()}
            rotate={projection.rotate()}
            pointRadius={pointRadius}
          >
            {(customProjection: any) => (
              <g>
                {gratOn ? (
                  <Graticule
                    graticule={(g) => customProjection.path(g) || ""}
                    stroke={sanitizeColor(gratColor)}
                    extentMinor={[
                      [extMinLong, minorMinLat],
                      [extMaxLong, minorMaxLat],
                    ]}
                    extentMajor={[
                      [extMinLong, majorMinLat],
                      [extMaxLong, majorMaxLat],
                    ]}
                    stepMinor={[stepSize, stepSize]}
                  />
                ) : null}
                {customProjection.features.map(
                  ({ feature, path }: any, i: number) => (
                    <path
                      key={`map-feature-${i}`}
                      d={path || ""}
                      fill={
                        feature.geometry.type ===
                        ("LineString" || "MultiLineString")
                          ? "transparent"
                          : typeof fill == "function"
                          ? sanitizeColor(fill(feature.properties))
                          : sanitizeColor(fill)
                      }
                      stroke={sanitizeColor(strokeColor)}
                      strokeWidth={strokeWidth}
                      onClick={() => {
                        if (events)
                          console.log(`Clicked: ${feature.properties}`);
                      }}
                    />
                  )
                )}
              </g>
            )}
          </CustomProjection>
        )}
      </svg>
    );
  } else if (data && !data.every(geometryChecker)) {
    throw "StaticMapComponent: geometry is missing from some entries";
  } else if (data && !data.every(propChecker)) {
    throw "StaticMapComponent: properties are missing from data";
  } else if (!(proj in basicProjections)) {
    throw "StaticMapComponent: projection is not available--check spelling of projection name";
  } else {
    throw "StaticMapComponent: issues with loading data";
  }
};
