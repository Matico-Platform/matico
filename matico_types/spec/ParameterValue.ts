// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { OptionGroupVals } from "./OptionGroupVals";

export type ParameterValue = { type: "optionGroup", value: OptionGroupVals } | { type: "boolean", value: boolean } | { type: "repeatedOption", value: Array<ParameterValue> } | { type: "numericFloat", value: number } | { type: "numericInt", value: number } | { type: "numericCategory", value: Array<number> } | { type: "textCategory", value: Array<string> } | { type: "column", value: string } | { type: "table", value: string } | { type: "text", value: string };