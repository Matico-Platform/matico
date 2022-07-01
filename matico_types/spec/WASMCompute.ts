import type { SpecParameterValue } from "./SpecParameterValue";

export interface WASMCompute { name: string, url: string, params: Record<string, SpecParameterValue>, }