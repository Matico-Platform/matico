import { Filter, Mapping } from "@maticoapp/matico_types/spec";
import { Column, DatasetSummary } from "Datasets/Dataset";

export { DataDrivenModal } from "./DataDrivenModal";
export interface DomainEditorProps {
    column: Column;
    dataset: DatasetSummary;
    rangeType: "color" | "value";
    filters: Array<Filter>;
    mapping: Mapping<number, number>;
    onUpdateMapping: (newMapping: any) => void;
}
