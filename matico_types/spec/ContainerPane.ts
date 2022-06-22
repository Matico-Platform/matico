import type { Layout } from "./Layout";
import type { PaneRef } from "./PaneRef";

export interface ContainerPane { name: string, id: string, layout: Layout, panes: Array<PaneRef>, }