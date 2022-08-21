import { BooleanOrAxisSpec } from '../components/types';
export interface MarginCalculation {
    xAxis: BooleanOrAxisSpec | undefined;
    yAxis: BooleanOrAxisSpec | undefined;
    xLabel: string | undefined;
    yLabel: string | undefined;
    attribution: string | undefined;
    title: string | undefined;
    subtitle: string | undefined;
    categorical: boolean | undefined;
}
