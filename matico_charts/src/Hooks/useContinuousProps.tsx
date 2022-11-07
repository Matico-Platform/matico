import React from "react";
import { useStore } from "../Store/maticoChartStore";
import {
    getBoolOrProperty,
    isBool,
    isFunc,
    isObj,
    nicelyFormatNumber,
} from "../Utils";
import { AxisSpec, ContinuousChartSpec } from "../components/types";

import { GridRows, GridColumns } from "@visx/grid";
import { scaleMapping } from "../Utils/scaleMapping";
import { axisMapping } from "../Utils/axisMapping";
import { GridScale } from "@visx/grid/lib/types";
import { AxisScale } from "@visx/axis";
import { AccessorFunction } from "../../types/components/types";
import { ContinuousDomain } from "@visx/scale";
import { Group } from "@visx/group";
import { useStateValueListener } from "./useStateListeneverValue";

export const useContinuousProps: () => {
    elements: React.ReactNode;
    params: ContinuousChartSpec;
} = () => {
    // selectors
    const setState = useStore((state) => state.setState);
    const height = useStore((state) => state.height);
    const width = useStore((state) => state.width);

    const data = useStore((state) => state.data);
    const type = useStore((state) => state.type);

    const xCol = useStore((state) => (state as ContinuousChartSpec).xCol);
    const yCol = useStore((state) => (state as ContinuousChartSpec).yCol);
    const xAxis = useStore((state) => (state as ContinuousChartSpec).xAxis);
    const yAxis = useStore((state) => (state as ContinuousChartSpec).yAxis);
    const xLabel = useStore((state) => (state as ContinuousChartSpec).xLabel);
    const yLabel = useStore((state) => (state as ContinuousChartSpec).yLabel);
    const xExtent = useStore((state) => (state as ContinuousChartSpec).xExtent);
    const yExtent = useStore((state) => (state as ContinuousChartSpec).yExtent);
    const grid = useStore((state) => (state as ContinuousChartSpec).grid);
    const margins = useStore((state) => state.margins)!;

    // global state listeners
    const yAccessor = useStateValueListener(
        "yAccessor",
        () => {
            let yAccessor: AccessorFunction = (_d) => 0;
            if (isFunc(yCol)) {
                yAccessor = yCol as AccessorFunction;
            } else if (yCol) {
                yAccessor = (d) => d[yCol as string | number];
            }
            setState({ yAccessor });
            return () => setState({ yAccessor: undefined });
        },
        [yCol]
    );

    const xAccessor = useStateValueListener(
        "xAccessor",
        () => {
            let xAccessor: AccessorFunction = (_d) => 0;
            if (isFunc(xCol)) {
                xAccessor = xCol as AccessorFunction;
            } else if (yCol) {
                xAccessor = (d) => d[xCol as string | number];
            }
            setState({ xAccessor });
            return () => setState({ xAccessor: undefined });
        },
        [xCol]
    );

    const xBounds = useStateValueListener(
        "xBounds",
        () => {
            let xBounds: ContinuousDomain = [0, 0];
            if (xExtent) {
                xBounds = xExtent;
            } else if (data && xAccessor) {
                const xData: number[] = data.map(xAccessor);
                xBounds = [Math.min(...xData), Math.max(...xData)];
            }
            setState({ xBounds });
            return () => setState({ xBounds: undefined });
        },
        [xAccessor?.toString(), JSON.stringify(xExtent)]
    );

    const yBounds = useStateValueListener(
        "yBounds",
        () => {
            let yBounds: ContinuousDomain = [0, 0];
            if (yExtent) {
                yBounds = yExtent;
            } else if (data && yAccessor) {
                const yData: number[] = data.map(yAccessor);
                yBounds = [Math.min(...yData), Math.max(...yData)];
            }
            setState({ yBounds });
            return () => setState({ yBounds: undefined });
        },
        [yAccessor?.toString(), JSON.stringify(yExtent)]
    );

    // local components
    const showColumnGrid = getBoolOrProperty(grid, true, "columns");
    const showRowGrid = getBoolOrProperty(grid, true, "rows");

    const xAxisProps = isObj(xAxis)
        ? (xAxis as AxisSpec)
        : ({
              display: true,
              position: "bottom",
              scaleType: "linear",
          } as AxisSpec);
    const yAxisProps = isObj(yAxis)
        ? (yAxis as AxisSpec)
        : ({
              display: true,
              position: "left",
              scaleType: "linear",
          } as AxisSpec);

    const xMax = useStateValueListener(
        "xMax",
        () => {
            setState({ xMax: width - margins.left! - margins.right! });
            return () => setState({ xMax: 0 });
        },
        [width, JSON.stringify(margins)]
    );

    const yMax = useStateValueListener(
        "yMax",
        () => {
            setState({ yMax: height - margins?.top! - margins?.bottom! });
            return () => setState({ yMax: 0 });
        },
        [height, JSON.stringify(margins)]
    );

    const XAxisEl = axisMapping[xAxisProps.position];
    const YAxisEl = axisMapping[yAxisProps.position];
    const xScale = useStateValueListener(
        "xScale",
        () => {
            let xScale;
            const xScaleFunc = scaleMapping[xAxisProps.scaleType];
            if (xBounds && xMax) {
                xScale = xScaleFunc<number>({
                    domain: xBounds,
                    range: [margins.left!, xMax],
                    clamp: true,
                    ...(isObj(xAxis) ? (xAxis as AxisSpec).scaleParams : {}),
                });
                setState({ xScale });
            }
            return () => setState({ xScale: undefined });
        },
        [xMax, JSON.stringify(xBounds), JSON.stringify(xAxisProps)]
    );

    const yScale = useStateValueListener(
        "yScale",
        () => {
            let yScale;
            const yScaleFunc = scaleMapping[yAxisProps.scaleType];
            if (yBounds && yMax) {
                yScale = yScaleFunc<number>({
                    domain: yBounds,
                    range: [yMax, margins.top!],
                    clamp: true,
                    ...(isObj(yAxis) ? (yAxis as AxisSpec).scaleParams : {}),
                });
                setState({ yScale });
            }
            return () => setState({ yScale: undefined });
        },
        [yMax, JSON.stringify(yBounds), JSON.stringify(yAxisProps)]
    );

    const params = {
        data,
        type,
        xCol,
        yCol,
        xAxis,
        yAxis,
        xLabel,
        yLabel,
        xExtent,
        yExtent,
        grid,
    } as ContinuousChartSpec;

    const elements = (
        <Group style={{ userSelect: "none" }}>
            {!!(showRowGrid && yScale) && (
                <GridRows
                    scale={yScale as GridScale}
                    width={xMax!}
                    height={yMax}
                    left={margins?.left}
                    top={margins?.top}
                    stroke="#e0e0e0"
                />
            )}
            {!!(showColumnGrid && xScale) && (
                <GridColumns
                    scale={xScale as GridScale}
                    width={xMax}
                    height={yMax!}
                    left={margins?.left}
                    top={margins?.top}
                    stroke="#e0e0e0"
                />
            )}
            {!!(getBoolOrProperty(yAxis, true, "display") && yScale) && (
                <YAxisEl
                    // orientation="left"
                    left={
                        yAxisProps.position === "right" ? xMax : margins?.left
                    }
                    top={margins.top}
                    scale={yScale as AxisScale}
                    //@ts-ignore
                    tickFormat={yAxis?.tickFormatFunc || nicelyFormatNumber}
                    label={yLabel || ""}
                />
            )}
            {!!(getBoolOrProperty(xAxis, true, "display") && xScale) && (
                <XAxisEl
                    // orientation="bottom"
                    top={xAxisProps.position === "bottom" ? yMax : margins?.top}
                    left={margins.left}
                    //@ts-ignore
                    tickFormat={xAxis?.tickFormatFunc || nicelyFormatNumber}
                    scale={xScale as AxisScale}
                    label={xLabel || ""}
                />
            )}
            {/* TODO labels, selection */}
        </Group>
    );

    return {
        params,
        elements,
    };
};
