import { VarOr } from "@maticoapp/matico_types/spec";
import { Column, DatasetState } from "Datasets/Dataset";
import { DatasetTransformStep } from "@maticoapp/matico_types/spec";

export interface FilterEditor {
    datasetId?: string;
    selectedColumn: Column;
    columns?: Array<Column>;
    onUpdateFilter: (newFilter: any) => void;
}

export interface RangeFilterEditorProps extends FilterEditor {
    min?: VarOr<number>;
    max?: VarOr<number>;
}

export interface DateRangeFilterEditorProps extends FilterEditor {
    min?: Date | { var: string };
    max?: Date | { var: string };
}

export interface CategoryFilterProps extends FilterEditor {
    isOneOf: Array<string | number>;
    isNotOneOf?: Array<string | number>;
}

export interface TransformStepProps {
    step: DatasetTransformStep;
    onChange: (update: Partial<DatasetTransformStep>) => void;
    columns?: Array<Column>;
    onRemove: (stepId: string) => void;
    datasetId?: string;
}

export interface DatasetTransformEditorProps {
    transformId: string;
    state: DatasetState;
}
