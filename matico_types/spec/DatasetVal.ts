import type { DatasetMetric } from "./DatasetMetric";
import type { Filter } from "./Filter";

export interface DatasetVal { dataset: string, column: string | null, metric: DatasetMetric | null, filters: Array<Filter> | null, featureId: string | null, }