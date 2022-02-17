//@ts-ignore
import React from "react";
import { BarSpec } from "../../types";
import { Bar } from "@visx/shape";
import { isFunc, sanitizeColor } from "../../../Utils";

export const BarComponent = (props: BarSpec) => {
  const {
    data = [],
    xScale = () => 0,
    yScale = () => 0,
    xAccessor = () => 0,
    yAccessor = () => 0,
    xBounds = [0, 0],
    yBounds = [0, 0],
    xMax = 0,
    yMax = 0,
    barTranslation = 0,
    color = "black",
    padding = 0,
    horizontal = false,
  } = {
    ...props,
    ...props.layer,
  };
  

  const barWidth = horizontal
    ? "bandwidth" in yScale
      ? //@ts-ignore
        yScale.bandwidth()
      : yMax / data.length
    : "bandwidth" in xScale
    ? //@ts-ignore
      xScale.bandwidth()
    : xMax / data.length

  const translationPx = barTranslation * barWidth;

  const colorScale = !color
    ? () => "gray"
    : isFunc(color)
    ? //@ts-ignore
      (d) => sanitizeColor(color(d))//@ts-ignore
    : () => sanitizeColor(color);
    
  return horizontal
    ? data.map((entry, i) => (
        <Bar
          key={`bar-${i}`}
          x={0}
          //@ts-ignore
          y={yScale(yAccessor(entry)) - translationPx  + (barWidth * (padding || 0)/2)}
          //@ts-ignore
          width={xScale(xAccessor(entry))}
          height={barWidth  * (1 - (padding || 0))}
          fill={colorScale(entry)}
        />
      ))
    : data.map((entry, i) => (
        <Bar
          key={`bar-${i}`}
          //@ts-ignore
          x={xScale(xAccessor(entry)) - translationPx  + (barWidth * (padding || 0)/2)}
          //@ts-ignore
          y={yScale(yAccessor(entry))}
          width={barWidth * (1 - (padding || 0))}
          //@ts-ignore
          height={yMax - yScale(yAccessor(entry))}
          fill={colorScale(entry)}
        />
      ));
};
