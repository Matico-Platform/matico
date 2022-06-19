import type { ContainerPane } from "./ContainerPane";
import type { ControlsPane } from "./ControlsPane";
import type { HistogramPane } from "./HistogramPane";
import type { MapPane } from "./MapPane";
import type { PieChartPane } from "./PieChartPane";
import type { ScatterplotPane } from "./ScatterplotPane";
import type { TextPane } from "./TextPane";

export type Pane = { type: "map" } & MapPane | { type: "text" } & TextPane | { type: "container" } & ContainerPane | { type: "histogram" } & HistogramPane | { type: "scatterplot" } & ScatterplotPane | { type: "pieChart" } & PieChartPane | { type: "controls" } & ControlsPane;