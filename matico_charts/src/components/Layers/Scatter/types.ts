import { ContinuousChartSpaceProps } from "../../ChartSpace/ContinuousChartSpace.types";
import { AccessorFunction } from "../../types";

export interface ScatterLayerProps extends Partial<ContinuousChartSpaceProps> {
    radiusColumn?: string | AccessorFunction;
    radiusScale?: number;
    radiusMin?: number;
    radiusMax?: number;
    colorColumn?: string | AccessorFunction;
    colorScale?: string;
    colorRange?: string[];
    colorDomain?: string[];
    colorReverse?: boolean;
    shapeColumn?: string | AccessorFunction;
    shapeList?: string[];
}

export interface ScatterLayerComponentsProps {
    index: number;
}

export interface ScatterLayerState {

}