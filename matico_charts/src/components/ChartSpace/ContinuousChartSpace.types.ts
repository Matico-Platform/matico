import {
    AccessorFunction,
    AxisSpec,
    BooleanOrBrushSpec,
    DataCollection,
    GridSpec,
    MarginSpec,
    xyDomainCallback,
    LayerSpec
} from '../types';

import {
    ContinuousDomain
} from '@visx/scale/lib/types/ScaleConfig'

export interface ContinuousChartSpaceProps {
    data: DataCollection;
    layers: LayerSpec[];
    tickFormatFunc?: (d: number) => string;
    xCol: string | AccessorFunction;
    xAxis?: boolean | AxisSpec;
    xAxisPos?: string;
    xLabel?: string;
    xMax: number;
    xExtent?: ContinuousDomain;
    yCol: string | AccessorFunction;
    yAxis?: boolean | AxisSpec;
    yAxisPos?: string;
    yLabel?: string;
    yMax: number;
    yExtent?: ContinuousDomain;
    grid?: boolean | GridSpec;
    // rendering props
    width: number;
    height: number;
    margin: MarginSpec, 
    useBrush: BooleanOrBrushSpec, 
    onBrush: xyDomainCallback,
    // inherited layout props, and the rest
    children: React.ReactNode;
}