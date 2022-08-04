// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Labels } from "./Labels";
import type { Layer } from "./Layer";
import type { MapProjection } from "./MapProjection";

export interface StaticMapPane { labels: Labels | null, name: string, id: string, layers: Array<Layer>, projection: MapProjection | null, showGraticule: boolean | null, }