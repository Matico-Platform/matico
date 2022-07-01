import type { DatasetVal } from "./DatasetVal";
import type { Variable } from "./Variable";

export type VarOr<T> = Variable | T | DatasetVal;