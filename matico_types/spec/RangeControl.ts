// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { VarOr } from "./VarOr";

export interface RangeControl {
  name: string;
  max: VarOr<number>;
  min: VarOr<number>;
  step: VarOr<number>;
  defaultValue: number;
  changeEvent: string | null;
}
