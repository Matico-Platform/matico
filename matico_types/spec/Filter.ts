// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CategoryFilter } from "./CategoryFilter";
import type { RangeFilter } from "./RangeFilter";
import type { RegExFilter } from "./RegExFilter";

export type Filter = { type: "noFilter" } | { type: "range" } & RangeFilter | { type: "category" } & CategoryFilter | { type: "regEx" } & RegExFilter;