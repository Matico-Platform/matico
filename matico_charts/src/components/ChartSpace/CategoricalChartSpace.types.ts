import {
    DataCollection,
    LayerSpec,
    MarginSpec,
} from '../types';

export interface CategoricalChartSpaceSpec {
    data: DataCollection;
    layers: LayerSpec[];
    width: number;
    height: number;
    margin: MarginSpec, 
    xMax: number;
    yMax: number;
    // inherited layout props, and the rest
    children: React.ReactNode;
}