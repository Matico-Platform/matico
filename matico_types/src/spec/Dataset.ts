import type { COGDataset } from "./COGDataset";
import type { CSVDataset } from "./CSVDataset";
import type { GeoJSONDataset } from "./GeoJSONDataset";
import type { MaticoApiDataset } from "./MaticoApiDataset";
import type { MaticoRemoteDataset } from "./MaticoRemoteDataset";
import type { WASMCompute } from "./WASMCompute";

export type Dataset = { type: "geoJSON" } & GeoJSONDataset | { type: "csv" } & CSVDataset | { type: "maticoRemote" } & MaticoRemoteDataset | { type: "maticoApi" } & MaticoApiDataset | { type: "cog" } & COGDataset | { type: "wasmcompute" } & WASMCompute;