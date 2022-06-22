import type { RangeControl } from "./RangeControl";
import type { SelectControl } from "./SelectControl";

export type Control = { type: "select" } & SelectControl | { type: "range" } & RangeControl;