import { View } from "@maticoapp/matico_spec";
export type StringVar = {
    type: "string";
    name: string;
    value: string;
};

export type NumberVar = {
    type: "number";
    name: string;
    value: number;
};

export type AnyVar = {
    type: any;
    name: string;
    value: any;
};

export type MapLocVar = {
    type: "mapLocVar";
    name: string;
    value: {
        lat: number;
        lng: number;
        bearing: number;
        pitch: number;
        zoom: number;
    };
};

interface SelectionRange {
    name: string;
    type: "SelectionRange";
    value: {
        variable: string;
        min: number;
        max: number;
    };
}
interface NoSelection {
    name: string;
    type: "NoSelection";
    value: {
        variable: string;
    };
}

type Selection = SelectionRange | NoSelection;

export type MaticoStateVariable =
    | StringVar
    | NumberVar
    | MapLocVar
    | AnyVar
    | Selection;
