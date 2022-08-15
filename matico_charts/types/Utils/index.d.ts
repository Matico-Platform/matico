import { ColorOutput } from "../components/types";
import { MarginCalculation } from "./utils.types";
export declare const isString: (x: any) => boolean;
export declare const isFunc: (x: any) => boolean;
export declare const isArray: (x: any) => boolean;
export declare const isBool: (x: any) => boolean;
export declare const isObj: (x: any) => boolean;
export declare const getBoolOrProperty: (boolOrObj: boolean | object | undefined, defaultValue: boolean | string, prop: string) => any;
export declare const sanitizeColor: (color: ColorOutput) => ColorOutput | null;
export declare const generateMargins: ({ xAxis, yAxis, xLabel, yLabel, attribution, title, subtitle, categorical, }: MarginCalculation) => {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
export declare const getTitleOffset: (title: string | boolean | undefined, subtitle: string | boolean | undefined, xAxisPos: string | boolean | undefined) => number;
export declare function nicelyFormatNumber(x: number | string): string | number;
