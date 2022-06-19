import type { DatasetRef } from "./DatasetRef";
import type { Labels } from "./Labels";
import type { PanePosition } from "./PanePosition";

export interface PieChartPane { name: string, id: string, position: PanePosition, dataset: DatasetRef, column: string, theme: string | null, labels: Labels | null, }