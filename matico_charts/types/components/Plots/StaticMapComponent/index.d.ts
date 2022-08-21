import * as React from "react";
import { StaticMapSpec, PlotLayersProperties } from "../../types";
declare module "react" {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}
export declare type ColorSpecification = {
    rgba: Array<number>;
} | {
    rgb: Array<number>;
} | {
    named: string;
} | {
    hex: string;
};
export declare const StaticMapComponent: React.FC<StaticMapSpec & PlotLayersProperties>;
