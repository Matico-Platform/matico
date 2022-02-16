//@ts-ignore
import React from "react";
import { Circle } from "@visx/shape";
import { ScatterSpec } from "../../types";
import { isFunc, sanitizeColor } from "../../../Utils";

export const ScatterplotComponent = ({
  data = [],
  xScale = () => 0,
  yScale = () => 0,
  xAccessor = () => 0,
  yAccessor = () => 0,
  color = "gray",
  scale = () => 1,
  shape = () => "circle",
  xOffset = 0,
  yOffset = 0,
}: ScatterSpec) => {
  if (!data || !xAccessor || !yAccessor) return null;
  const fill = isFunc(color)
    ? //@ts-ignore
      (d) => sanitizeColor(color(d))
      //@ts-ignore
    : () => sanitizeColor(color) || [];
  //@ts-ignore
  const r = isFunc(scale) ? (d) => scale(d) : () => scale || 1;
  return <g style={{transform:`translate(${xOffset}px, ${yOffset}px)`}}>{data.map((point, i) => (
    <Circle
      key={`point-${point[0]}-${i}`}
      className="dot"
      //@ts-ignore
      cx={xScale(xAccessor(point))}
      //@ts-ignore
      cy={yScale(yAccessor(point))}
      r={r(point)}
      // @ts-ignore
      fill={fill(point)}
    />
  ))}</g>
};
