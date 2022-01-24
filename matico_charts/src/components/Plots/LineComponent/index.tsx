//@ts-ignore
import React from 'react';
import { LineSpec } from '../../types';
import { LinePath } from '@visx/shape';

export const LineComponent = (props: LineSpec) => {
  const {
    data = [],
    xScale = () => 0,
    yScale = () => 0,
    xAccessor = () => 0,
    yAccessor = () => 0,
    xBounds = [0, 0],
    yBounds = [0, 0],
    lineColor = 'gray',
    lineWidth = 1,
    lineFunction = undefined,
  } = {
    ...props,
    ...props.layer,
  };
  const chartData = lineFunction
    ? [
        //@ts-ignore
        [xBounds[0], lineFunction(xBounds[0])],
        //@ts-ignore
        [xBounds[1], lineFunction(xBounds[1])],
      ]
    : data;

  if (!chartData) return null;
  if (lineFunction) {
    return (
      <LinePath
        stroke={lineColor || 'gray'}
        strokeWidth={lineWidth || 2}
        data={chartData}
        //@ts-ignore
        x={(d) => xScale(d[0])}
        //@ts-ignore
        y={(d) => yScale(d[1])}
      />
    );
  }
  return (
    <LinePath
      stroke={lineColor || 'gray'}
      strokeWidth={2}
      data={chartData}
      //@ts-ignore
      x={(d) => xScale(xAccessor(d)) ?? 0}
      //@ts-ignore
      y={(d) => yScale(yAccessor(d)) ?? 0}
    />
  );
};
