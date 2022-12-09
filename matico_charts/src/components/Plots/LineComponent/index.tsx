import * as React from "react";
import { LineSpec, PlotLayersProperties } from "../../types";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";

// Divides an interval [a, b] into 100 subintervals
export const intervalPartitioner = (interval: number[]) => {
  const intervalLength = interval[1] - interval[0];
  const meshLength = intervalLength / 100;
  const partitionValues: number[] = [];

  for (let i = 0; i < 100; i++) {
    partitionValues.push(interval[0] + i * meshLength);
  }

  return partitionValues;
};

export const LineComponent = (props: LineSpec & PlotLayersProperties) => {
  const {
    data = [],
    xScale = () => 0,
    yScale = () => 0,
    xAccessor = () => 0,
    yAccessor = () => 0,
    xBounds = [0, 0],
    yBounds = [0, 0],
    lineColor = "gray",
    lineWidth = 1,
    lineFunction = undefined,
  } = {
    ...props,
    ...props.layer,
  };

  // The following are defined for graphing lineFunction on the x-axis

  //@ts-ignore
  const tickMarks = intervalPartitioner(xBounds);
  const lineFunctionPoints: any = [];

  lineFunction
    ? tickMarks.forEach((element) =>
        lineFunctionPoints.push([element, lineFunction(element)])
      )
    : lineFunctionPoints.push(0);

  const chartData = lineFunction ? lineFunctionPoints : data;

  if (!chartData) return null;
  if (lineFunction) {
    return (
      <LinePath
        stroke={lineColor || "gray"}
        strokeWidth={lineWidth || 2}
        data={lineFunctionPoints}
        curve={curveMonotoneX}
        //@ts-ignore
        x={(d) => xScale(d[0])}
        //@ts-ignore
        y={(d) => yScale(d[1])}
      />
    );
  } else {
    return (
      <LinePath
        stroke={lineColor || "gray"}
        strokeWidth={2}
        data={chartData}
        //@ts-ignore
        x={(d) => xScale(xAccessor(d)) ?? 0}
        //@ts-ignore
        y={(d) => yScale(yAccessor(d)) ?? 0}
      />
    );
  }
};

// strokeDashArray -- see how visx handles this
// For the data example to work, we need the keys in each of object (inside the array)
// to be numbers. Might need to expand on this so that they can also be strings.
