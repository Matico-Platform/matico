import {
  CartographicChartspec,
  CategoricalChartSpec,
  ContinuousChartSpec,
} from "../../types";
import { ContinuousChartState } from "../Continuous/types";

export type ChartspaceEngineSpec = ({type: "continuous"} & ContinuousChartState) | CategoricalChartSpec | CartographicChartspec;