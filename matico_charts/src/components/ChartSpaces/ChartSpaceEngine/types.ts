import {
  CartographicChartspec,
  CategoricalChartSpec,
  ContinuousChartSpec,
} from "../../types";
import { ContinuousChartSpaceState } from "../AxisBased/types";


// enum StateMapping {
//   continuous = ContinuousChartSpaceState,
//   // categorical: CategoricalChartSpec,
//   // cartographic: CartographicChartspec,
// }

export type ChartspaceEngineSpec = 
  {type: "continuous"} & ContinuousChartSpaceState
  | {type: "categorical"} & CategoricalChartSpec 
  | {type: "cartographic"} & CartographicChartspec;