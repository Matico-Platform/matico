import type { Control } from "./Control";
import type { PanePosition } from "./PanePosition";

export interface ControlsPane { name: string, id: string, title: string, position: PanePosition, controls: Array<Control>, }