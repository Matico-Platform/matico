import {DiscreteQuantizer,ContinuiousQuantizer,ContinuiousRange} from './Quantizers'
import {QuerySource,DatasetSource,RawQuerySource,GeoJSONSource} from './Sources'

export const DefaultFillColor: Color = [140, 170, 180, 90];
export const DefaultStrokeColor: Color = [200, 200, 200, 90];
export enum Unit {
    pixels = 'pixels',
    meters = 'meters',
}

export interface ValueSpecification {
    column?: string;
    simpleValue?: number;
    discreteQuantizer?: DiscreteQuantizer;
    continuiousQuantizer?: ContinuiousQuantizer;
    continuiousRange?: ContinuiousRange;
    // discreteRange?: DiscreteRange;
}

export interface ValueColorSpecification {
    values: ValueSpecification;
    colors: Color[];
}

export interface ColorSpecification {
    single_color?: SingleColorSpecification;
    category_color?: CategoryColorSpecification;
}

export enum ScaleFunc {
    Linear = <any>'linear',
    Sqrt = <any>'sqrt',
    log = <any>'log',
}

export const DefaultPolyonStyle: PolygonStyle = {
    fill: { single_color: { color: DefaultFillColor } },
    stroke: { single_color: { color: DefaultStrokeColor } },
    stroke_width: 3,
    opacity: 1,
    stroke_units: Unit.pixels,
    elevation: null,
};

export const DefaultPointStyle: PointStyle = {
    fill: { single_color: { color: DefaultFillColor } },
    size: 20,
    stroke: { single_color: { color: DefaultStrokeColor } },
    stroke_width: 3,
    opacity: 1,
    stroke_units: Unit.pixels,
    size_units: Unit.pixels,
};

export const DefaultLineStyle: LineStyle = {
    stroke: { single_color: { color: DefaultStrokeColor } },
    stroke_width: 3,
    opacity: 1,
}

export enum BaseMap {
    Light = 'Light',
    Dark = 'Dark',
    Satelite = 'Satelite',
    Terrain = 'Terrain',
    Streets = 'Streets',
    CartoDBPositron = 'CartoDBPositron',
    CartoDBVoyager = 'CartoDBVoyager',
    CartoDBDarkMatter = 'CartoDBDarkMatter',
    Custom = 'Custom',
}

export const DefaultMapStyle: MapStyle = {
    center: [-74.006, 40.7128],
    zoom: 13,
    base_map: BaseMap.Light,
    layers: [],
};

export type Color = [number, number, number, number];


export interface MapStyle {
    layers: Layer[];
    center: number[];
    zoom: number;
    base_map: BaseMap;
}

export type LayerStyle = {
    Point?: PointStyle;
    Polygon?: PolygonStyle;
    Line?: LineStyle;
};

export interface Layer {
    source: LayerSource;
    style: LayerStyle;
    name: string;
    description: string;
}

export interface SingleColorSpecification {
    color: Color;
}

export interface CategoryColorSpecification {
    column: string;
    categories: Array<string | number>;
    colors: Array<Color>;
}

export type LayerSource =
    | QuerySource
    | DatasetSource
    | RawQuerySource
    | GeoJSONSource;



export interface PointStyle {
    fill: ColorSpecification;
    size: number;
    stroke: ColorSpecification;
    stroke_width: number;
    opacity: number;
    size_units: Unit;
    stroke_units: Unit;
}

export interface PolygonStyle {
    fill: ColorSpecification;
    stroke: ColorSpecification;
    stroke_width: number;
    opacity: number;
    stroke_units: Unit;
    elevation: ValueSpecification | null;
}

export interface LineStyle {
    stroke: ColorSpecification;
    stroke_width: number;
    opacity: number;
}


