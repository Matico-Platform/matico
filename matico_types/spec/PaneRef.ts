// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PaneDetails } from "./PaneDetails";

export type PaneRef =
  | ({ type: "map" } & PaneDetails)
  | ({ type: "text" } & PaneDetails)
  | ({ type: "container" } & PaneDetails)
  | ({ type: "histogram" } & PaneDetails)
  | ({ type: "scatterplot" } & PaneDetails)
  | ({ type: "pieChart" } & PaneDetails)
  | ({ type: "controls" } & PaneDetails)
  | ({ type: "staticMap" } & PaneDetails)
  | ({ type: "categorySelector" } & PaneDetails)
  | ({ type: "dateTimeSlider" } & PaneDetails);
