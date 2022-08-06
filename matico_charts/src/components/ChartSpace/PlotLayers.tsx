import React from "react";
import { Group } from "@visx/group";
import { PlotComponentMapping } from "../Plots";
import { DataCollection, LayerSpec } from "../types";

interface PlotLayersSpec {
  data: DataCollection;
  layers: LayerSpec[];
  xMax: number;
  yMax: number;
}

export default function PlotLayers({
  data = [],
  layers = [],
  xMax = 0,
  yMax = 0,
  ...rest
}: PlotLayersSpec) {
  return layers.length ? (
      <g>
        {layers.map((layer: any, i: number) => {
          if (!layer.type) return null;
          //@ts-ignore
          const CurrentComponent = PlotComponentMapping[layer.type];
          return (
            //@ts-ignore
            <CurrentComponent
            key={`layer-${i}-${layer.type}`}
              {...{ data, xMax, yMax, ...rest, ...layer }}
            />
          );
        })}
      </g>
  ) : null;
}
