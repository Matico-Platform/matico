//@ts-ignore
import React from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { PieSpec } from '../../types';

export const PieChartComponent = (props: PieSpec) => {
  const {
    data=[],
    valueAccessor=()=>0,
    reverseSort=false,
    labelAccessor=()=>'',
    color=()=>'gray',
    padding = 0,
    innerRadius = 0,
    onClick = () => {},
    yMax=0,
    xMax=0,
  } = {
    ...props,
    ...props.layer,
  };
  return (
    <Pie
      data={data}
      pieValue={valueAccessor}
      pieSortValues={reverseSort ? ()=>-1 : ()=>1}
      outerRadius={(Math.min(xMax, yMax) / 2) * (1 - padding)}
      innerRadius={(Math.min(xMax, yMax) / 2) * (1 - padding) * innerRadius}
    >
      {(pie) => (
        <PieSlice
          {...pie}
          getKey={(data) => labelAccessor(data)}
          onClickDatum={({ data }) => onClick(data)}
          getColor={({ data }) => color(data)}
        />
      )}
    </Pie>
  );
};

function PieSlice({ arcs, path, getKey, getColor, onClickDatum }) {
  return arcs.map((arc, idx) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
    return (
      <g key={`arc-${idx}`}>
        <path
          // compute interpolated path d attribute from intermediate angle values
          d={path({ ...arc })}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <g>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={16}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc.data)}
            </text>
          </g>
        )}
      </g>
    );
  });
}
