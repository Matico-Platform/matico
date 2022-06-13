/* tslint:disable */
/* eslint-disable */
/**
*/
export enum ScreenUnits {
  Pixels,
  Percent,
}
/**
*/
export class COGDataset {
  free(): void;
}
/**
*/
export class CSVDataset {
  free(): void;
/**
* @returns {string}
*/
  name: string;
}
/**
*/
export class ChartPane {
  free(): void;
/**
*/
  position: PanePosition;
}
/**
*/
export class ContainerPane {
  free(): void;
/**
*/
  position: PanePosition;
}
/**
*/
export class ControlsPane {
  free(): void;
/**
*/
  position: PanePosition;
}
/**
*/
export class Dashboard {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} val
* @returns {Dashboard}
*/
  static from_js(val: any): Dashboard;
/**
* @param {string} val
* @returns {Dashboard}
*/
  static from_json(val: string): Dashboard;
/**
* @returns {any}
*/
  is_valid(): any;
/**
* @returns {any}
*/
  to_js(): any;
/**
* @returns {string}
*/
  to_toml(): string;
/**
* @returns {string}
*/
  to_yaml(): string;
/**
* @returns {any}
*/
  created_at: any;
/**
* @returns {any}
*/
  datasets: any;
/**
* @returns {string}
*/
  name: string;
/**
* @returns {any}
*/
  pages: any;
/**
* @returns {any}
*/
  theme: any;
}
/**
*/
export class GeoJSONDataset {
  free(): void;
/**
* @returns {string}
*/
  name: string;
}
/**
*/
export class HistogramPane {
  free(): void;
/**
* @returns {string}
*/
  name: string;
/**
*/
  position: PanePosition;
}
/**
*/
export class Labels {
  free(): void;
}
/**
*/
export class MapPane {
  free(): void;
/**
* @returns {string}
*/
  name: string;
/**
*/
  position: PanePosition;
}
/**
*/
export class MaticoApiDataset {
  free(): void;
}
/**
*/
export class MaticoRemoteDataset {
  free(): void;
/**
* @returns {string | undefined}
*/
  dataset_id: string;
/**
* @returns {string}
*/
  description: string;
/**
* @returns {string}
*/
  name: string;
/**
* @returns {string}
*/
  server_url: string;
}
/**
*/
export class Page {
  free(): void;
/**
* @returns {string | undefined}
*/
  content: string;
/**
* @returns {string | undefined}
*/
  icon: string;
/**
* @returns {string}
*/
  name: string;
/**
*/
  order: number;
/**
* @returns {string | undefined}
*/
  path: string;
/**
* @returns {any}
*/
  sections: any;
}
/**
*/
export class PanePosition {
  free(): void;
/**
*/
  float: boolean;
/**
*/
  height: number;
/**
* @returns {string}
*/
  readonly height_units: string;
/**
*/
  layer: number;
/**
*/
  width: number;
/**
* @returns {string}
*/
  readonly width_units: string;
/**
*/
  x?: number;
/**
* @returns {string}
*/
  readonly x_units: string;
/**
*/
  y?: number;
/**
* @returns {string}
*/
  readonly y_units: string;
}
/**
*/
export class PieChartPane {
  free(): void;
/**
* @returns {string}
*/
  name: string;
/**
*/
  position: PanePosition;
}
/**
*/
export class RangeControl {
  free(): void;
}
/**
*/
export class ScatterplotPane {
  free(): void;
/**
* @returns {string}
*/
  name: string;
/**
*/
  position: PanePosition;
}
/**
*/
export class Section {
  free(): void;
/**
* @returns {string}
*/
  layout: string;
/**
*/
  order: number;
/**
* @returns {any}
*/
  panes: any;
}
/**
*/
export class SelectControl {
  free(): void;
}
/**
*/
export class TextPane {
  free(): void;
/**
* @returns {string | undefined}
*/
  background: string;
/**
* @returns {string}
*/
  content: string;
/**
* @returns {string | undefined}
*/
  font: string;
/**
* @returns {string}
*/
  name: string;
/**
*/
  position: PanePosition;
}
/**
*/
export class Theme {
  free(): void;
/**
* @returns {string | undefined}
*/
  icon: string;
/**
* @returns {any}
*/
  primaryColor: any;
/**
* @returns {any}
*/
  secondaryColor: any;
}
/**
*/
export class ValidationResult {
  free(): void;
/**
*/
  is_valid: boolean;
}
/**
*/
export class View {
  free(): void;
/**
*/
  bearing: number;
/**
*/
  lat: number;
/**
*/
  lng: number;
/**
*/
  pitch: number;
/**
*/
  zoom: number;
}
