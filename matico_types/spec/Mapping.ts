import type { Range } from "./Range";
import type { VarOr } from "./VarOr";

export interface Mapping<D, R> { variable: string, domain: VarOr<Array<D>>, range: VarOr<Range<R>>, }