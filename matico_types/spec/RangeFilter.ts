import type { VarOr } from "./VarOr";

export interface RangeFilter { variable: string, min: VarOr<number> | null, max: VarOr<number> | null, }