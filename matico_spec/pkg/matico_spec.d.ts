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
export class App {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} val
* @returns {App}
*/
  static from_js(val: any): App;
/**
* @param {string} val
* @returns {App}
*/
  static from_json(val: string): App;
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
  description: string;
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
  panes: any;
/**
* @returns {any}
*/
  theme: any;
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
export class Metadata {
  free(): void;
}
/**
*/
export class Page {
  free(): void;
/**
* @param {string} pane_type
* @param {string} pane_id
*/
  add_pane(pane_type: string, pane_id: string): void;
/**
* @param {string} before_pane_id
* @param {string} pane_type
* @param {string} pane_id
*/
  add_pane_before(before_pane_id: string, pane_type: string, pane_id: string): void;
/**
* @param {string} after_pane_id
* @param {string} pane_type
* @param {string} pane_id
*/
  add_pane_after(after_pane_id: string, pane_type: string, pane_id: string): void;
/**
* @param {string} pane_id
* @param {number} new_pos
*/
  move_pane_to_position(pane_id: string, new_pos: number): void;
/**
* @param {string} pane_type
* @param {string} pane_id
* @param {number} index
*/
  add_pane_at_position(pane_type: string, pane_id: string, index: number): void;
/**
* @param {number} index
*/
  remove_pane_at_position(index: number): void;
/**
* @param {string} pane_id
*/
  remove_pane(pane_id: string): void;
/**
* @returns {string | undefined}
*/
  icon: string;
/**
* @returns {string}
*/
  name: string;
/**
* @returns {string | undefined}
*/
  path: string;
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
  pad_bottom?: number;
/**
*/
  pad_left?: number;
/**
*/
  pad_right?: number;
/**
*/
  pad_top?: number;
/**
* @returns {string}
*/
  readonly pad_units_bottom: string;
/**
* @returns {string}
*/
  readonly pad_units_left: string;
/**
* @returns {string}
*/
  readonly pad_units_right: string;
/**
* @returns {string}
*/
  readonly pad_units_top: string;
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
/**
*/
export class WASMCompute {
  free(): void;
}
