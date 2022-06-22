import type { DatasetRef } from "./DatasetRef";
import type { LayerStyle } from "./LayerStyle";

export interface Layer { name: string, id: string, source: DatasetRef, style: LayerStyle, }