import type { DomainVal } from "./DomainVal";
import type { Mapping } from "./Mapping";
import type { Variable } from "./Variable";

export type MappingVarOr<T> = Variable | Mapping<DomainVal, T> | T;