import { useGlobalOrLayer } from "../../../Hooks/useGlobalOrLayer";
import { useStore } from "../../../Store/maticoChartStore";
import { ScatterLayerState } from "./types";

export function useScatterLayerState(layerIndex: number): ScatterLayerState {
    const layer = useStore((state) => state?.layers?.[layerIndex]);
    const { value: xAccessor } = useGlobalOrLayer(
        layer!,
        layerIndex,
        "xAccessor"
    );
    const { value: yAccessor } = useGlobalOrLayer(
        layer!,
        layerIndex,
        "yAccessor"
    );
    
    const xScale = useStore((state) => state.xScale);
    const yScale = useStore((state) => state.yScale);
    const data = useStore((state) => state.data);
    return {
        xScale,
        yScale,
        data,
        xAccessor,
        yAccessor,
    }
}