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
export enum LinearLayoutDirection {
  Horizontal,
  Vertical,
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
*/
  created_at: any;
/**
*/
  datasets: any;
/**
*/
  description: string;
/**
*/
  name: string;
/**
*/
  pages: any;
/**
*/
  panes: any;
/**
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
*/
  name: string;
}
/**
*/
export class ContainerPane {
  free(): void;
}
/**
*/
export class ControlsPane {
  free(): void;
}
/**
*/
export class GeoJSONDataset {
  free(): void;
/**
*/
  name: string;
}
/**
*/
export class GridLayout {
  free(): void;
}
/**
*/
export class HistogramPane {
  free(): void;
/**
*/
  name: string;
}
/**
*/
export class Labels {
  free(): void;
}
/**
*/
export class LinearLayout {
  free(): void;
}
/**
*/
export class MapPane {
  free(): void;
/**
*/
  name: string;
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
*/
  dataset_id: string;
/**
*/
  description: string;
/**
*/
  name: string;
/**
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
*/
  icon: string;
/**
*/
  name: string;
/**
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
*/
  readonly pad_units_bottom: string;
/**
*/
  readonly pad_units_left: string;
/**
*/
  readonly pad_units_right: string;
/**
*/
  readonly pad_units_top: string;
/**
*/
  width: number;
/**
*/
  readonly width_units: string;
/**
*/
  x?: number;
/**
*/
  readonly x_units: string;
/**
*/
  y?: number;
/**
*/
  readonly y_units: string;
}
/**
*/
export class PieChartPane {
  free(): void;
/**
*/
  name: string;
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
*/
  name: string;
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
*/
  background: string;
/**
*/
  content: string;
/**
*/
  font: string;
/**
*/
  name: string;
}
/**
*/
export class Theme {
  free(): void;
/**
*/
  icon: string;
/**
*/
  primaryColor: any;
/**
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
