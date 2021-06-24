
export interface DiscreteQuantizer {
    method: NumericalCategorizationMethod;
    breaks?: number[];
    no_breaks: number;
}

export interface ContinuiousQuantizer {
    log: boolean;
    sqrt: boolean;
    maxVal: number;
    minVal: number;
}

export interface ContinuiousRange {
    min: number;
    max: number;
}

export interface DiscreteRange {
    values: number[];
}


export enum NumericalCategorizationMethod {
    Quantiles = 'quantiles',
    EqualInterval = 'equal_interval',
    Scaled = 'scaled',
    Custom = 'custom',
}
