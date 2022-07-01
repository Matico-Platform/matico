import type { DatasetRef } from "./DatasetRef";
import type { Labels } from "./Labels";

export interface PieChartPane { name: string, id: string, dataset: DatasetRef, column: string, theme: string | null, labels: Labels | null, }