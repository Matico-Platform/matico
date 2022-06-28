import type { VarOr } from "./VarOr";

export type SpecParameterValue = { type: "numericFloat" } & VarOr<number> | { type: "numericInt" } & VarOr<number> | { type: "numericCategory" } & VarOr<Array<number>> | { type: "textCategory" } & VarOr<Array<string>> | { type: "column" } & VarOr<string> | { type: "table" } & VarOr<string> | { type: "text" } & VarOr<string>;