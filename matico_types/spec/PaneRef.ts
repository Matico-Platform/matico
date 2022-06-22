import type { PaneDetails } from "./PaneDetails";

export type PaneRef = { type: "map" } & PaneDetails | { type: "text" } & PaneDetails | { type: "container" } & PaneDetails | { type: "histogram" } & PaneDetails | { type: "scatterplot" } & PaneDetails | { type: "pieChart" } & PaneDetails | { type: "controls" } & PaneDetails;