//@ts-ignore
import React from 'react';
import { Circle } from '@visx/shape';
import { HeatmapSpec, PlotLayersProperties } from '../../types';
import { HeatmapCircle, HeatmapRect } from '@visx/heatmap';
import { isFunc, sanitizeColor } from '../../../Utils';
import { scaleLinear } from '@visx/scale';

export const HeatmapComponent = (props: HeatmapSpec & PlotLayersProperties) => {
  const {
    data = [],
    binnedData = [],
    // xScale = () => 0,
    // yScale = () => 0,
    xAccessor = () => 0,
    yAccessor = () => 0,
    color = 'gray',
    scale = () => 1,
    shape = () => 'circle',
    xBounds,
    yBounds,
    xBins,
    yBins,
    xStep,
    yStep,
    maxCount,
    xMax,
    yMax,
  } = {
    ...props,
    ...props.layer,
  };

  if (!data || !xAccessor || !yAccessor) return null;

  const lxStep = xStep || (xBounds[1] - xBounds[0]) / (xBins);
  const lyStep = yStep || (yBounds[1] - yBounds[0]) / (yBins);
  
  const processedResults =
    !binnedData.length &&
    !maxCount &&
    processData({
      data,
      xBins,
      yBins,
      xBounds,
      yBounds,
      xAccessor,
      yAccessor,
      xStep: lxStep,
      yStep: lyStep,
    });

  const cleanedData = binnedData.length ? binnedData : processedResults.data;
  const lMaxCount = maxCount ? maxCount : processedResults.maxCount;

  const binWidth = xMax / xBins;
  const binHeight = yMax / yBins;

  const colorScale = scaleLinear({
    domain: [0, lMaxCount],
    range: ['white', 'red'],
  });
  const xScale = scaleLinear({
    domain: [0, xBins],
    range: [0, xMax],
  });
  const yScale = scaleLinear({
    domain: [0, yBins],
    range: [0, yMax],
  });
  return (
    <HeatmapRect
      data={cleanedData}
      xScale={xScale}
      yScale={yScale}
      colorScale={colorScale}
      opacityScale={() => 1}
      binWidth={binWidth}
      binHeight={binHeight}
      gap={2}
    >
      {(heatmap) => {
        console.log(heatmap);
        return heatmap.map((heatmapBins) =>
          heatmapBins.map((bin) => (
            <rect
              key={`heatmap-rect-${bin.row}-${bin.column}`}
              className="visx-heatmap-rect"
              width={bin.width}
              height={bin.height}
              x={bin.x}
              y={bin.y}
              fill={bin.color}
              fillOpacity={bin.opacity}
              onClick={() => {
                if (!events) return;
                const { row, column } = bin;
                alert(JSON.stringify({ row, column, bin: bin.bin }));
              }}
            />
          ))
        );
      }}
    </HeatmapRect>
  );
};

function processData({
  data,
  xBins,
  yBins,
  xBounds,
  yBounds,
  xAccessor,
  yAccessor,
  xStep,
  yStep,
}) {
  const rowBins = () => Array(yBins)
    .fill(null)
    .map((_, i) => ({ bin: i, count: 0 }));

  let returnData = Array(xBins)
    .fill(null)
    .map((_, i) => ({ bin: i * yStep, bins: rowBins() }));
  for (let i = 0; i < data.length; i++) {
    const xCoord = Math.min(Math.floor(xAccessor(data[i]) / xStep), xBins-1)
    const yCoord = Math.min(Math.floor(yAccessor(data[i]) / yStep), yBins-1)    
    returnData[xCoord].bins[yBins-1-yCoord].count += 1;
  }
  let maxCount = 0;
  for (let i = 0; i < yBins; i++) {
    for (let j = 0; j < xBins; j++)
      maxCount = Math.max(returnData[j].bins[i].count, maxCount);
  }
  return {
    data: returnData,
    maxCount,
  };
}
