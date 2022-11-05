import React from "react";
import { Group } from "@visx/group";
import { LayerSpec } from "../../types";

import { ScatterLayer } from "../Scatter";
import { useStore } from "../../../Store/maticoChartStore";
// import { HeatmapComponent } from './HeatmapComponent';

const LayerMapping = {
  scatter: ScatterLayer,
  //   'line': LineComponent,
  //   'bar': BarComponent,
  //   'pie': PieChartComponent,
  //   "map": StaticMapComponent
  // 'heatmap': HeatmapComponent,
};

const LayerEngine: React.FC = () => {
  const [layers] = useStore((state) => state.layers);
  if (!layers?.length) return null;
  
  return (
    <Group>
      {layers.map((layer: LayerSpec, i: number) => {
        if (!layer) return null;
        const layerType = layer.type as keyof typeof LayerMapping;
        const Layer = LayerMapping[layerType];
        if (!Layer) return null;
        return <Layer key={`layer-${i}`} index={i} />;
      })}
    </Group>
  );
};
