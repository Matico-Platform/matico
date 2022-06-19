import type { Layout } from "./Layout";
import type { PaneRef } from "./PaneRef";

export interface Page { name: string, icon: string | null, panes: Array<PaneRef>, path: string | null, layout: Layout, }