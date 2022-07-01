import type { CategoryFilter } from "./CategoryFilter";
import type { RangeFilter } from "./RangeFilter";

export type Filter = { type: "noFilter" } | { type: "range" } & RangeFilter | { type: "category" } & CategoryFilter;