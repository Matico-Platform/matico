import { AnyD3Scale, ContinuousDomain } from "@visx/scale";
import { ContinuousChartSpaceProps } from "../../ChartSpace/ContinuousChartSpace.types";
import { ContinuousChartSpaceState } from "../../ChartSpaces/AxisBased/types";
import { AccessorFunction } from "../../types";

export type Shape = "circle" | "square" | "triangle"
export interface ScatterLayerProps extends Partial<ContinuousChartSpaceState> {
    radiusColumn?: string | AccessorFunction;
    radiusRange?: ContinuousDomain;
    colorColumn?: string | AccessorFunction;
    colorScheme?: string;
    shapeColumn?: string | AccessorFunction;
    shapeList?: Shape[];
}

export interface ScatterLayerComponentsProps {
    layerIndex: number;
}

export interface ScatterLayerDerivedState {
    radiusAccessor?: AccessorFunction;
    radiusScale?: AnyD3Scale;
    colorAccessor?: AccessorFunction;
    colorScale?: AnyD3Scale;
    shapeAccessor?: AccessorFunction;
    shapeScale?: AnyD3Scale;

    xAccessor?: AccessorFunction;
    yAccessor?: AccessorFunction;
    xBounds?: ContinuousDomain;
    yBounds?: ContinuousDomain;
    yScale?: AnyD3Scale;
    xScale?: AnyD3Scale;
}


export type ScatterLayerState = ScatterLayerProps & ScatterLayerProps