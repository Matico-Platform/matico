import { DataCollection, LayerSpec } from "../types";
interface PlotLayersSpec {
  data: DataCollection;
  layers: LayerSpec[];
  xMax: number;
  yMax: number;
}
export default function PlotLayers({
  data,
  layers,
  xMax,
  yMax,
  ...rest
}: PlotLayersSpec): JSX.Element | null;
export {};
