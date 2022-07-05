import type { ColorSpecification } from "./ColorSpecification";
import type { MappingVarOr } from "./MappingVarOr";
import type { ScaleType } from "./ScaleType";

export interface LayerStyle { size: MappingVarOr<number> | null, fillColor: MappingVarOr<ColorSpecification> | null, opacity: MappingVarOr<number> | null, visible: boolean | null, lineColor: MappingVarOr<ColorSpecification> | null, lineWidth: MappingVarOr<number> | null, lineWidthScale: number | null, lineUnits: ScaleType | null, radiusUnits: ScaleType | null, radiusScale: number | null, elevation: MappingVarOr<number> | null, elevationScale: number | null, }