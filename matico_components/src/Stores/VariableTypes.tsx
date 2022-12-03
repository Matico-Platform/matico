export type VariableValue =
    | StringVar
    | NumberVar
    | MapViewVar
    | SelectionVar
    | RangeVar
    | CategoryVar
    | BoundsVar
    | FeatureVar
    | FeaturesVar
    | GeoFeatureVar
    | GeoFeaturesVar
    | DateRangeVar;

export type MaticoStateVariable = {
    id: string;
    paneId: string;
    name: string;
    value: VariableValue;
};

export type StringVar = {
    type: "string";
    value: string;
};

export type DateRangeVar = {
    type: "dateRange";
    value:
        | {
              min: Date;
              max: Date;
          }
        | "NoSelection";
};

export type NumberVar = {
    type: "number";
    value: string;
};

export type FeatureVar = {
    type: "feature";
    name: string;
    value: Record<string, any> | "NoSelection";
};

export type GeoFeatureVar = {
    type: "geofeature";
    value: Record<string, any> | "NoSelection";
};

export type FeaturesVar = {
    type: "features";
    value: Array<Record<string, any>> | "NoSelection";
};

export type GeoFeaturesVar = {
    type: "geofeatures";
    value: Array<Record<string, any>> | "NoSelection";
};

export type SelectionVar = {
    type: "selection";
    value: Array<string | number> | "NoSelection";
};

export type CategoryVar = {
    type: "category";
    value: {
        oneOf: Array<string | number>;
        notOneOf: Array<string | number>;
    };
};

export type BoundsVar = {
    type: "bounda";
    value: {
        xmin: number;
        xmax: number;
        ymin: number;
        ymax: number;
    };
};

export type MapViewVar = {
    type: "mapview";
    value: {
        lat: number;
        lng: number;
        bearing: number;
        pitch: number;
        zoom: number;
    };
};

export type RangeVar = {
    type: "range";
    value:
        | {
              min: number;
              max: number;
          }
        | "NoSelection";
};
