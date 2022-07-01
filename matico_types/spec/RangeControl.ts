import type { VarOr } from "./VarOr";

export interface RangeControl { name: string, max: VarOr<number>, min: VarOr<number>, step: VarOr<number>, defaultValue: number, }