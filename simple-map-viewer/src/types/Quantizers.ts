
export interface QuantileQuantizer {
    noBins : number;  
    excludeMin: number; 
    excludeMax: number;
}

export interface EqualIntervalQuantizer {
  noBins: number;
  excludeMin: number;
  excludeMax: number;
} 

export interface CategoryQuantizer {
  custom?: string[];
  topN?: number
}


export enum NumericalCategorizationMethod {
    Quantiles = 'quantiles',
    EqualInterval = 'equal_interval',
    Scaled = 'scaled',
    Custom = 'custom',
}
