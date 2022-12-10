import React, { useRef } from "react";
import { Group } from "@visx/group";
import PlotLayers from "./PlotLayers";
import { CategoricalChartSpaceSpec } from "./CategoricalChartSpace.types";

export default function CategoricalChartSpace({
  data,
  layers,
  width,
  height,
  margin,
  children,
  xMax,
  yMax,
  ...rest
}: CategoricalChartSpaceSpec) {
  const svgRef = useRef<SVGSVGElement>(null);
  return (
    <svg width={width} height={height} ref={svgRef}>
      <rect width={width} height={height} rx={14} fill={"white"} />
      <Group left={margin.left + xMax / 2} top={margin.top + yMax / 2}>
        <PlotLayers
          data={data}
          layers={layers}
          xMax={xMax}
          yMax={yMax}
          {...{
            ...rest,
          }}
        />
      </Group>
      {children}
    </svg>
  );
}
