//@ts-ignore
import React from 'react';
import { BarSpec } from '../../types';
import { Bar } from '@visx/shape';
import { isFunc, sanitizeColor } from '../../../Utils';

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
    xTranslate = false,
    color = 'black',
    padding = 0,
  } = {
    ...props,
    ...props.layer,
  };

  const barWidth =
    'bandwidth' in xScale
      ? //@ts-ignore
        xScale.bandwidth()
      : (xMax / data.length) * (1 - (padding || 0));
  const xTranslationPx = 'bandwidth' in xScale ? 0 : xTranslate || barWidth / 2;

  const colorScale = !color
    ? () => 'gray'
    : isFunc(color)
    ? //@ts-ignore
      (d) => color(d) //@ts-ignore
    : (d) => sanitizeColor(color);
    
  return data.map((entry, i) => (
    <Bar
      key={`bar-${i}`}
      //@ts-ignore
      x={xScale(xAccessor(entry)) - xTranslationPx}
      //@ts-ignore
      y={yMax - yScale(yAccessor(entry))}
      width={barWidth}
      //@ts-ignore
      height={yScale(yAccessor(entry))}
      fill={colorScale(entry)}
    />
  ));
};
