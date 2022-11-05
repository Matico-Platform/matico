import { ChartSpaceSpec } from "../components/types";
import createFastContext from "./createFastContext";

const initialState: ChartSpaceSpec = {
  data: [],
};

const { Provider, useStore } = createFastContext<ChartSpaceSpec>(initialState);

export { Provider, useStore };
