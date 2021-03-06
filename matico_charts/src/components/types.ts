import { Scale } from '@visx/brush/lib/types';
import { ContinuousDomain } from '@visx/scale';
//layout
export type MarginSpec = {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type Domain2D = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
// data
export type DataRow = { [property: string]: any };
export type DataCollection = Array<DataRow>;

// outputs and params
export type HexColor = string;
export type StringColor = string;
export type RgbColor = [number, number, number];
export type RgbaColor = [number, number, number, number];
export type ColorOutput = HexColor | StringColor | RgbColor | RgbaColor;
export type ShapeOutput = 'circle' | 'rectangle' | 'polygon' | 'text';
export type ScaleType = 'linear' | 'log' | 'power' | 'sqrt';
export type YAxisPosition = 'left' | 'right';
export type XAxisPosition = 'bottom' | 'top';

//scales
interface ScaleSpec {
  domain: ContinuousDomain;
  range: any;
  clamp: boolean;
}

// functions
export type LineFunction = (d: number) => number;
export type ColorFunction = (d: DataRow) => ColorOutput;
export type SizeFunction = (d: DataRow) => number;
export type AccessorFunction = (d: DataRow) => number;
export type XYFunction = (d: number) => number;
export type InteractiveFunction = (
  e: React.SyntheticEvent<EventTarget>
) => void;
export type DataInteractiveFunction = (d: DataRow) => void;
export type ShapeFunction = (d: DataRow) => ShapeOutput;
export type ScaleFunction = (d: ScaleSpec) => any;
// error bars
export interface ErrorSpec {
  radius?: number | AccessorFunction;
  xMin?: AccessorFunction;
  xMax?: AccessorFunction;
  yMin?: AccessorFunction;
  yMax?: AccessorFunction;
}

// layers
export interface BaseLayerSpec {
  type: 'scatter' | 'line' | 'bar' | 'pie';
  data?: DataCollection;
  layer?: OverwriteProperty;
  xError?: ErrorSpec;
  yError?: ErrorSpec;
  xBounds?: ContinuousDomain;
  yBounds?: ContinuousDomain;
  // axis specifications
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

export interface ScatterSpec extends BaseLayerSpec {
  color?: ColorFunction | ColorOutput;
  scale?: number | SizeFunction;
  shape?: string | ShapeFunction;
  onHover?: InteractiveFunction;
  onSelect?: InteractiveFunction;
  tooltip?: boolean; // TooltipSpec;
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
  xBins: number,
  yBins: number,
  binnedData?: DataCollection[]
}

export type LayerSpec = ScatterSpec | LineSpec | BarSpec | PieSpec | HeatmapSpec;

// layouts
export type OverwriteProperty = { [property: string]: any };
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
export type BooleanOrAxisSpec = boolean | AxisSpec;
export interface WidthAndHeight {
  width: number;
  height: number;
}

//interactions
export interface BrushSpec {
  horizontal: boolean;
  vertical: boolean;
}
export type BooleanOrBrushSpec = boolean | BrushSpec;
export interface Domain {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
export type xyDomainCallback = (d: Domain) => void;

export interface ChartSpaceSpec {
  //data
  data: DataCollection;
  // axis specifications
  xCol?: string | AccessorFunction;
  yCol?: string | AccessorFunction;
  xAxis?: boolean | AxisSpec;
  yAxis?: boolean | AxisSpec;
  xLabel?: string;
  yLabel?: string;
  xExtent?: ContinuousDomain;
  yExtent?: ContinuousDomain;
  //categorical plots
  categorical?: boolean;
  valueAccessor?: AccessorFunction;
  labelAccessor?: AccessorFunction;
  // layers
  layers?: Array<LayerSpec>;
  // chart junk
  title?: string;
  subtitle?: string;
  grid?: boolean | GridSpec;
  attribution?: string;
  // layout
  dimensions?: WidthAndHeight;
  useBrush?: BooleanOrBrushSpec;
  onBrush?: xyDomainCallback;
}