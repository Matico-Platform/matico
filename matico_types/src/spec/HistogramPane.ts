import type { ColorSpecification } from "./ColorSpecification";
import type { DatasetRef } from "./DatasetRef";
import type { Labels } from "./Labels";
import type { MappingVarOr } from "./MappingVarOr";
import type { PanePosition } from "./PanePosition";

export interface HistogramPane { name: string, id: string, position: PanePosition, dataset: DatasetRef, column: string, color: MappingVarOr<ColorSpecification> | null, maxbins: bigint | null, labels: Labels | null, }