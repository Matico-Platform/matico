import type { ColorSpecification } from "./ColorSpecification";
import type { TiledLayer } from "./TiledLayer";

export type BaseMap = { type: "color" } & ColorSpecification | { type: "tiledLayer" } & TiledLayer | { type: "image" } & string | { type: "named" } & string | { type: "stileJSON" } & string;