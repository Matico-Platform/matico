import React, { useState, useMemo, useRef } from "react";
import { Group } from "@visx/group";
import { PatternLines } from "@visx/pattern";
import { GridRows, GridColumns } from "@visx/grid";
import { Brush } from "@visx/brush";
import {
  scaleLinear,
  scaleBand,
  scaleLog,
  scalePower,
  scaleSqrt,
  scaleTime,
} from "@visx/scale";
import { AxisTop, AxisRight, AxisBottom, AxisLeft } from "@visx/axis";
import debounce from "lodash/debounce";
import { localPoint } from "@visx/event";
import PlotLayers from "./PlotLayers";
import {
  isBool,
  isFunc,
  isObj,
  getBoolOrProperty,
  nicelyFormatNumber,
} from "../../Utils";

// types
import { EventType } from "@visx/event/lib/types";
import { AccessorFunction, DataRow, Domain2D } from "../types";
import { ContinuousChartSpaceProps } from "./ContinuousChartSpace.types";

let tooltipTimeout: number;

const scaleMapping = {
  linear: scaleLinear,
  log: scaleLog,
  power: scalePower,
  sqrt: scaleSqrt,
  band: scaleBand,
  time: scaleTime,
};

const brushInteractionMapping = {
  both: ["top", "left", "bottom", "right"],
  vertical: ["top", "bottom"],
  horizontal: ["left", "right"],
};
export default function ContinuousChartspace({
  // data space props
  data,
  layers,
  xCol,
  tickFormatFunc = nicelyFormatNumber,
  xAxis = false,
  xAxisPos,
  xLabel,
  xMax,
  xExtent,
  yCol,
  yAxis,
  yAxisPos,
  yLabel,
  yMax,
  yExtent,
  grid,
  // rendering props
  width,
  height,
  margin,
  useBrush,
  onBrush,
  // inherited layout props, and the rest
  children,
  ...rest
}: ContinuousChartSpaceProps) {
  // internal chart interaction state
  const svgRef = useRef<SVGSVGElement>(null);
  const [brushDim, setBrushDim] = useState({
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [brushing, setBrushing] = useState(false);
  const brushRef = useRef(null);

  // Chart space x and y axis scale
  const xAccessor = isFunc(xCol)
    ? (xCol as AccessorFunction)
    : (d: DataRow) => d[xCol as string];

  const yAccessor = isFunc(yCol)
    ? (yCol as AccessorFunction)
    : (d: DataRow) => d[yCol as string];

  let xBounds: number[];
  if (xExtent) {
    xBounds = xExtent;
  } else if (data) {
    const xData = data.map(xAccessor);
    xBounds = [Math.min(...xData), Math.max(...xData)];
  } else {
    const layerExtents = layers.map((l) => {
      const xData = l.data?.map(xAccessor);
      return [Math.min(...xData!), Math.max(...xData!)];
    });
    xBounds = [
      Math.min(...layerExtents.map((le) => le[0])),
      Math.max(...layerExtents.map((le) => le[1])),
    ];
  }

  let yBounds: number[];
  if (yExtent) {
    yBounds = yExtent;
  } else if (data) {
    const yData = data.map(yAccessor);
    yBounds = [Math.min(...yData), Math.max(...yData)];
  } else {
    const layerExtents = layers.map((l) => {
      const yData = l.data?.map(yAccessor);
      return [Math.min(...yData!), Math.max(...yData!)];
    });
    yBounds = [
      Math.min(...layerExtents.map((le) => le[0])),
      Math.max(...layerExtents.map((le) => le[1])),
    ];
  }

  // Axis and grid definition
  const XAxis = xAxisPos === "bottom" ? AxisBottom : AxisTop;
  const YAxis = yAxisPos === "left" ? AxisLeft : AxisRight;
  const showColumnGrid = getBoolOrProperty(grid, false, "columns");
  const showRowGrid = getBoolOrProperty(grid, false, "rows");

  const xScaleFunc = isObj(xAxis)
    ? //@ts-ignore
      scaleMapping[xAxis.scaleType]
    : scaleMapping["linear"];

  const yScaleFunc = isObj(yAxis)
    ? //@ts-ignore
      scaleMapping[yAxis.scaleType]
    : scaleMapping["linear"];

  const xScale = useMemo(
    () =>
      //@ts-ignore
      xScaleFunc<number>({
        domain: xBounds,
        range: [0, xMax],
        clamp: true,
        //@ts-ignore
        ...(isObj(yAxis) ? xAxis.scaleParams : {}),
      }),
    [width, xBounds]
  );

  const yScale = useMemo(
    () =>
      //@ts-ignore
      yScaleFunc<number>({
        domain: yBounds,
        range: [yMax, 0],
        clamp: true,
        //@ts-ignore
        ...(isObj(yAxis) ? yAxis.scaleParams : {}),
      }),
    [height, yBounds]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: {
        x: xScale(brushDim.x0),
        y: yScale(brushDim.y0),
      },
      end: {
        x: xScale(brushDim.x1),
        y: yScale(brushDim.y1),
      },
    }),
    [brushing]
  );

  const onBrushChange = (domain: Domain2D) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    onBrush({
      x0,
      x1,
      y0,
      y1,
    });
    setBrushDim({
      x0,
      x1,
      y0,
      y1,
    });
  };

  const debouncedOnBrushChange = useMemo(
    () => debounce(onBrushChange, 1),
    [JSON.stringify(brushDim)]
  );

  const handleMouseDown = (e: EventType) => {
    if (useBrush) {
      setBrushing(false);
      const { x, y } = localPoint(e) || { x: 0, y: 0 };
      setDragging(true);
      setBrushDim((prev) => ({
        ...prev,
        x0: xScale.invert(sanitizeX(x - margin.left)),
        y0: yScale.invert(sanitizeY(y - margin.top)),
        x1: xScale.invert(sanitizeX(x - margin.left)),
        y1: yScale.invert(sanitizeY(y - margin.top)),
      }));
    }
  };
  const handleMouseMove = (e: EventType) => {
    if (useBrush && dragging) {
      const { x, y } = localPoint(e) || { x: 0, y: 0 };
      setBrushDim((prev) => {
        const newDim = {
          ...prev,
          x1: xScale.invert(sanitizeX(x - margin.left)),
          y1: yScale.invert(sanitizeY(y - margin.top)),
        };
        return newDim;
      });
    }
  };

  const debouncedHandleMouseMove = useMemo(
    () => debounce(handleMouseMove, 1),
    [JSON.stringify(brushDim)]
  );

  const handleMouseLeave = () => {
    if (useBrush) {
      setDragging(false);
      setBrushing(true);
      onBrush(brushDim);
    }
  };

  const brushDirection = useMemo(() => {
    if (isBool(useBrush) && useBrush) return "both";
    const vertical = getBoolOrProperty(useBrush, false, "vertical");
    const horizontal = getBoolOrProperty(useBrush, false, "horizontal");
    if (vertical && horizontal) return "both";
    if (vertical) return "vertical";
    if (horizontal) return "horizontal";
  }, [JSON.stringify(useBrush || null)]);

  if (!data || width < 10) return null;

  const sanitizeX = (val: number) => {
    if (val > xMax) return xMax;
    if (val < margin.left) return margin.left;
    return val;
  };
  const sanitizeY = (val: number) => {
    if (val > yMax) return xMax;
    if (val < margin.top) return margin.top;
    return val;
  };

  return (
    <svg width={width} height={height} ref={svgRef}>
      <rect
        width={width}
        height={height}
        // rx={14}
        fill={"white"}
        onMouseDown={handleMouseDown}
        onMouseMove={debouncedHandleMouseMove}
        onMouseUp={handleMouseLeave}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseLeave}
      />

      <PatternLines
        id="lines"
        height={5}
        width={5}
        stroke={"rgba(0,0,0,0.25)"}
        strokeWidth={1}
        orientation={["diagonal"]}
      />

      <Group pointerEvents="none" left={margin.left} top={margin.top}>
        {!!useBrush && !brushing && (
          <path
            d={`M ${xScale(brushDim.x0)} ${yScale(brushDim.y0)} H ${xScale(
              brushDim.x1
            )} V ${yScale(brushDim.y1)} H ${xScale(brushDim.x0)} Z`}
            fill="url('#lines')"
            stroke="black"
          />
        )}
        {showRowGrid && (
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
        )}
        {showColumnGrid && (
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
        )}

        <PlotLayers
          data={data}
          layers={layers}
          xMax={xMax}
          yMax={yMax}
          {...{
            xScale,
            yScale,
            xAccessor,
            yAccessor,
            ...rest,
          }}
        />

        {children}
        {getBoolOrProperty(yAxis, true, "display") && (
          <YAxis
            // orientation="left"
            left={yAxisPos === "right" ? width - margin.left - margin.right : 0}
            scale={yScale}
            //@ts-ignore
            tickFormat={yAxis?.tickFormatFunc || tickFormatFunc}
            label={yLabel || ""}
          />
        )}
        {getBoolOrProperty(xAxis, true, "display") && (
          <XAxis
            // orientation="bottom"
            top={
              xAxisPos === "bottom" ? height - margin.top - margin.bottom : 0
            } //@ts-ignore
            tickFormat={xAxis?.tickFormatFunc || tickFormatFunc}
            scale={xScale}
            label={xLabel || ""}
          />
        )}
        {brushing && (
          <Brush
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            margin={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            handleSize={8}
            innerRef={brushRef}
            // resizeTriggerAreas={
            //   brushInteractionMapping[brushDirection] as ResizeTriggerAreas
            // }
            brushDirection={brushDirection}
            initialBrushPosition={initialBrushPosition}
            //@ts-ignore
            onBrushEnd={debouncedOnBrushChange}
            selectedBoxStyle={{
              fill: `url('#lines')`,
              stroke: "white",
            }}
            useWindowMoveEvents
          />
        )}
      </Group>
    </svg>
  );
}
