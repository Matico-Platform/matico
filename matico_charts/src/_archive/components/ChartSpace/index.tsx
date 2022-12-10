import React from "react";
import {
  getBoolOrProperty,
  generateMargins,
  getTitleOffset,
} from "../../Utils";
import { ChartSpaceSpec } from "../types";
import CategoricalChartSpace from "./CategoricalChartSpace";
import ContinuousChartspace from "./ContinuousChartSpace";

export default function ChartSpace({
  xAxis,
  yAxis,
  xLabel,
  yLabel,
  title,
  subtitle,
  attribution,
  dimensions,
  categorical,
  ...rest
}: ChartSpaceSpec) {
  // dimensions from parent
  const { width, height } = dimensions || { width: 0, height: 0 };
  const margin = generateMargins({
    xAxis,
    yAxis,
    xLabel,
    yLabel,
    title,
    subtitle,
    attribution,
    categorical,
  });
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const xAxisPos = getBoolOrProperty(xAxis, "bottom", "position");
  const yAxisPos = getBoolOrProperty(yAxis, "left", "position");
  const titleY = categorical
    ? getTitleOffset(title, subtitle, xAxisPos) + margin.top
    : getTitleOffset(title, subtitle, xAxisPos) - 24;
  const subtitleY = categorical
    ? getTitleOffset(title, subtitle, xAxisPos) + margin.top + 24
    : getTitleOffset(title, subtitle, xAxisPos);

  const ChartSpaceWrapper = categorical
    ? CategoricalChartSpace
    : ContinuousChartspace;
  return (
    //@ts-ignore
    <ChartSpaceWrapper
      {...{
        xAxis,
        xAxisPos,
        xLabel,
        xMax,
        yAxis,
        yAxisPos,
        yLabel,
        yMax,
        margin,
        width,
        height,
        ...rest,
      }}
    >
      {!!title && (
        <text
          x={xMax / 2}
          y={titleY}
          fontSize={24}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Varela Round', Helvetica, Arial, sans-serif"
        >
          {title}
        </text>
      )}
      {!!subtitle && (
        <text
          x={xMax / 2}
          y={subtitleY}
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Varela Round', Helvetica, Arial, sans-serif"
        >
          {subtitle}
        </text>
      )}
      {!!attribution && (
        <text
          x={xMax}
          y={yMax}
          fontSize={10}
          textAnchor="end"
          fontFamily="'Varela Round', Helvetica, Arial, sans-serif"
        >
          {attribution}
        </text>
      )}
    </ChartSpaceWrapper>
  );
}
