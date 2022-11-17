import {
    AccessorFunction,
    AxisSpec,
    BooleanOrBrushSpec,
    DataCollection,
    GridSpec,
    xyDomainCallback,
    LayerSpec
} from '../../types';

import {
    ContinuousDomain
} from '@visx/scale/lib/types/ScaleConfig'
import { AnyD3Scale } from '@visx/scale';

export interface ContinuousChartSpaceProps {
    data: DataCollection;
    tickFormatFunc?: (d: number) => string;
    xCol: string | AccessorFunction;
    xAxis?: boolean | AxisSpec;
    xAxisPos?: string;
    xLabel?: string;
    xExtent?: ContinuousDomain;
    yCol: string | AccessorFunction;
    yAxis?: boolean | AxisSpec;
    yAxisPos?: string;
    yLabel?: string;
    yExtent?: ContinuousDomain;
    grid?: boolean | GridSpec;
    // rendering props
    useBrush?: BooleanOrBrushSpec, 
    onBrush?: xyDomainCallback,
}

export interface ContinuiousChartDerivedState {
    xAccessor?: AccessorFunction;
    yAccessor?: AccessorFunction;
    xBounds?: ContinuousDomain;
    yBounds?: ContinuousDomain;
    yScale?: AnyD3Scale;
    xScale?: AnyD3Scale;
}

export type ContinuousChartSpaceState = ContinuousChartSpaceProps & ContinuiousChartDerivedState;