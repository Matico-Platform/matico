import type { Filter } from "./Filter";

export interface DatasetRef { name: string, filters: Array<Filter> | null, }