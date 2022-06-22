import type { ColorSpecification } from "./ColorSpecification";
import type { DatasetRef } from "./DatasetRef";
import type { Labels } from "./Labels";
import type { MappingVarOr } from "./MappingVarOr";

export interface ScatterplotPane { name: string, id: string, dataset: DatasetRef, xColumn: string, yColumn: string, dotColor: MappingVarOr<ColorSpecification> | null, dotSize: MappingVarOr<number> | null, labels: Labels | null, }