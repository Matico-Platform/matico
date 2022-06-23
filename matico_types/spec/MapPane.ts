import type { BaseMap } from "./BaseMap";
import type { Layer } from "./Layer";
import type { VarOr } from "./VarOr";
import type { View } from "./View";

export interface MapPane { name: string, id: string, view: VarOr<View>, layers: Array<Layer>, baseMap: BaseMap | null, }