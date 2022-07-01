import type { ColorSpecification } from "./ColorSpecification";
import type { DatasetRef } from "./DatasetRef";
import type { Labels } from "./Labels";
import type { MappingVarOr } from "./MappingVarOr";

export interface HistogramPane { name: string, id: string, dataset: DatasetRef, column: string, color: MappingVarOr<ColorSpecification> | null, maxbins: number | null, labels: Labels | null, }