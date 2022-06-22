import type { VarOr } from "./VarOr";

export interface MaticoApiDataset { name: string, description: string, serverUrl: string, apiId: string | null, params: Record<string, VarOr<number>>, }