import type { Layout } from "./Layout";
import type { PanePosition } from "./PanePosition";
import type { PaneRef } from "./PaneRef";

export interface ContainerPane { name: string, id: string, position: PanePosition, layout: Layout, panes: Array<PaneRef>, }