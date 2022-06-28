import type { ColType } from "./ColType";
import type { ParameterOptionDisplayDetails } from "./ParameterOptionDisplayDetails";

export interface ColumnOptions { allowedColumnTypes: Array<ColType> | null, fromDataset: string, displayDetails: ParameterOptionDisplayDetails, }