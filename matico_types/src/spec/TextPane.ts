import type { PanePosition } from "./PanePosition";

export interface TextPane { name: string, id: string, position: PanePosition, content: string, font: string | null, background: string | null, }