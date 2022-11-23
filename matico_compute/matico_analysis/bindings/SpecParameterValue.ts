// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { SpecParameter } from "./SpecParameter";
import type { VarOr } from "./VarOr";

export type SpecParameterValue =
  | { type: "optionGroup"; value: Array<VarOr<SpecParameter>> }
  | { type: "repeatedOption"; value: Array<VarOr<SpecParameterValue>> }
  | { type: "numericFloat"; value: VarOr<number> }
  | { type: "numericInt"; value: VarOr<number> }
  | { type: "numericCategory"; value: VarOr<Array<number>> }
  | { type: "textCategory"; value: VarOr<Array<string>> }
  | { type: "column"; value: VarOr<string> }
  | { type: "table"; value: VarOr<string> }
  | { type: "text"; value: VarOr<string> };
