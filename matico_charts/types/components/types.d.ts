/// <reference types="react" />
import { ContinuousDomain } from '@visx/scale';
export declare type MarginSpec = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare type Domain2D = {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export declare type DataRow = {
    [property: string]: any;
};
export declare type DataCollection = Array<DataRow>;
export declare type HexColor = string;
export declare type StringColor = string;
export declare type RgbColor = [number, number, number];
export declare type RgbaColor = [number, number, number, number];
export declare type ColorOutput = HexColor | StringColor | RgbColor | RgbaColor;
export declare type ShapeOutput = 'circle' | 'rectangle' | 'polygon' | 'text';
export declare type ScaleType = 'linear' | 'log' | 'power' | 'sqrt';
export declare type YAxisPosition = 'left' | 'right';
export declare type XAxisPosition = 'bottom' | 'top';
interface ScaleSpec {
    domain: ContinuousDomain;
    range: any;
    clamp: boolean;
}
export declare type LineFunction = (d: number) => number;
export declare type ColorFunction = (d: DataRow) => ColorOutput;
export declare type SizeFunction = (d: DataRow) => number;
export declare type AccessorFunction = (d: DataRow) => number;
export declare type XYFunction = (d: number) => number;
export declare type InteractiveFunction = (e: React.SyntheticEvent<EventTarget>) => void;
export declare type DataInteractiveFunction = (d: DataRow) => void;
export declare type ShapeFunction = (d: DataRow) => ShapeOutput;
export declare type ScaleFunction = (d: ScaleSpec) => any;
export interface ErrorSpec {
    radius?: number | AccessorFunction;
    xMin?: AccessorFunction;
    xMax?: AccessorFunction;
    yMin?: AccessorFunction;
    yMax?: AccessorFunction;
}
export interface BaseLayerSpec {
    type: 'scatter' | 'line' | 'bar' | 'pie' | 'map';
    data?: DataCollection;
    layer?: OverwriteProperty;
    xError?: ErrorSpec;
    yError?: ErrorSpec;
    xBounds?: ContinuousDomain;
    yBounds?: ContinuousDomain;
    xAccessor?: AccessorFunction;
    yAccessor?: AccessorFunction;
    valueAccessor?: AccessorFunction;
    labelAccessor?: AccessorFunction;
    xScale?: ScaleFunction;
    yScale?: ScaleFunction;
    xExtent?: ContinuousDomain;
    yExtent?: ContinuousDomain;
    onClick?: InteractiveFunction;
    onHover?: InteractiveFunction;
    xOffset?: number;
    yOffset?: number;
}
export interface StaticMapSpec extends BaseLayerSpec {
    proj: string;
    rotation?: number;
    fill?: ColorFunction | ColorOutput;
    gratOn?: boolean;
    gratColor?: ColorOutput;
    strokeWidth?: number;
    strokeColor?: ColorOutput;
    pointRadius?: number;
    events?: boolean;
}
export interface ScatterSpec extends BaseLayerSpec {
    color?: ColorFunction | ColorOutput;
    scale?: number | SizeFunction;
    shape?: string | ShapeFunction;
    onHover?: InteractiveFunction;
    onSelect?: InteractiveFunction;
    tooltip?: boolean;
}
export interface LineSpec extends BaseLayerSpec {
    lineFunction?: LineFunction;
    lineColor?: string;
    lineWidth?: number;
}
export interface BarSpec extends BaseLayerSpec {
    padding?: number;
}
export interface PieSpec extends BaseLayerSpec {
    reverseSort?: boolean;
    innerRadius?: number;
    padding?: number;
}
export interface HeatmapSpec extends BaseLayerSpec {
    xBins: number;
    yBins: number;
    binnedData?: DataCollection[];
}
export declare type LayerSpec = ScatterSpec | LineSpec | BarSpec | PieSpec | HeatmapSpec | StaticMapSpec;
export declare type OverwriteProperty = {
    [property: string]: any;
};
export interface AxisSpec {
    position: YAxisPosition | XAxisPosition;
    scaleType: ScaleType;
    display?: boolean;
    scaleParams?: OverwriteProperty;
}
export interface GridSpec {
    columns: boolean;
    rows: boolean;
}
export declare type BooleanOrAxisSpec = boolean | AxisSpec;
export interface WidthAndHeight {
    width: number;
    height: number;
}
export interface BrushSpec {
    horizontal: boolean;
    vertical: boolean;
}
export declare type BooleanOrBrushSpec = boolean | BrushSpec;
export interface Domain {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}
export declare type xyDomainCallback = (d: Domain) => void;
export interface ChartSpaceSpec {
    data: DataCollection;
    xCol?: string | AccessorFunction;
    yCol?: string | AccessorFunction;
    xAxis?: boolean | AxisSpec;
    yAxis?: boolean | AxisSpec;
    xLabel?: string;
    yLabel?: string;
    xExtent?: ContinuousDomain;
    yExtent?: ContinuousDomain;
    categorical?: boolean;
    valueAccessor?: AccessorFunction;
    labelAccessor?: AccessorFunction;
    layers?: Array<LayerSpec>;
    title?: string;
    subtitle?: string;
    grid?: boolean | GridSpec;
    attribution?: string;
    dimensions?: WidthAndHeight;
    useBrush?: BooleanOrBrushSpec;
    onBrush?: xyDomainCallback;
}
export interface PlotLayersProperties {
    xMax: number;
    yMax: number;
}
export {};
