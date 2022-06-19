import type { DatasetRef } from "./DatasetRef";
import type { LayerStyle } from "./LayerStyle";

export interface Layer { name: string, source: DatasetRef, order: number, style: LayerStyle, }