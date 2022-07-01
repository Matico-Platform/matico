import type { ColorSpecification } from "./ColorSpecification";
import type { ImageBaseMap } from "./ImageBaseMap";
import type { NamedBaseMap } from "./NamedBaseMap";
import type { StyleJSONBaseMap } from "./StyleJSONBaseMap";
import type { TiledLayer } from "./TiledLayer";

export type BaseMap = { type: "color" } & ColorSpecification | { type: "tiledLayer" } & TiledLayer | { type: "image" } & ImageBaseMap | { type: "named" } & NamedBaseMap | { type: "styleJSON" } & StyleJSONBaseMap;