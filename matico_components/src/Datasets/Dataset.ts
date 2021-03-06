import {
    Dataset as DatasetSpec,
    Filter,
    RangeFilter,
    CategoryFilter
} from "@maticoapp/matico_types/spec";

import {
    HistogramResults,
    ValueCountsResults
} from "@maticoapp/matico_types/api";

export enum DatasetState {
    LOADING = "LOADING",
    ERROR = "ERROR",
    READY = "READY"
}
export interface Column {
    name: string;
    type: string;
}

export enum GeomType {
    Point = "Point",
    Polygon = "Polygon",
    Line = "Line",
    None = "None"
}

//TODO Explicitly type this at some point
export type Datum = any;

export interface DatasetSummary {
    name: string;
    geomType?: GeomType;
    columns?: Array<Column>;
    local?: boolean;
    state: DatasetState;
    error?: string;
    tiled?: boolean;
    raster?: boolean;
    mvtUrl?: string;
    spec: DatasetSpec;
}

export type HistogramBin = {
    binStart: number;
    binEnd: number;
    count: number;
};

export interface Dataset {
    name: string;
    idCol: string;
    columns: () => Promise<Column[]>;
    getData: (
        filters?: Array<Filter>,
        columns?: Array<string>,
        limit?: number
    ) => Promise<Datum[]>;
    getFeature: (feature_id: string) => Promise<Datum | undefined>;
    local: () => boolean;
    tiled: () => boolean;
    raster: () => boolean;
    mvtUrl?: () => string;
    isReady: () => boolean;
    geometryType: () => Promise<GeomType>;
    onStateChange?: (reportState: (state: DatasetState) => void) => void;
    getColumnMax: (column: string) => Promise<number>;
    getColumnMin: (column: string) => Promise<number>;
    getColumnSum: (column: string) => Promise<number>;
    getColumnHistogram: (
        column: string,
        noBins: number,
        filters: Array<Filter>
    ) => Promise<HistogramResults>;
    getCategoryCounts: (
        columns: string,
        filters?: Array<Filter>
    ) => Promise<ValueCountsResults>;
    getCategories: (
        columns: string,
        noCategories: number,
        filters?: Array<Filter>
    ) => Promise<Array<string | number>>;
    getEqualIntervalBins: (
        column: string,
        bins: number,
        filters?: Array<Filter>
    ) => Promise<Array<number>>;
    getQuantileBins: (
        column: string,
        bins: number,
        filters?: Array<Filter>
    ) => Promise<Array<number>>;
    getJenksBins: (
        column: string,
        bins: number,
        filters?: Array<Filter>
    ) => Promise<Array<number[]>>;

    // metricForColumn?: (columnName:string, metric: DatasetMetric)=> any
}
