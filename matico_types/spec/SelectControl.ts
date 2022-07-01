import type { VarOr } from "./VarOr";

export interface SelectControl { name: string, options: VarOr<Array<string>>, defaultValue: string | null, }