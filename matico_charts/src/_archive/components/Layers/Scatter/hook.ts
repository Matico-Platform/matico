import { useGlobalOrLayer } from "../../../Hooks/useGlobalOrLayer";
import { useStore } from "../../../Store/maticoChartStore";
import { ScatterLayerState } from "./types";

export function useScatterLayerState(layerIndex: number): ScatterLayerState {
    const layer = useStore((state) => state?.layers?.[layerIndex])!;

    const { value: data } = useGlobalOrLayer({
        key:"data",
        layer,
        layerIndex,
    });

    const { value: xAccessor } = useGlobalOrLayer({
        key:"xAccessor",
        shouldUpdate: false,
        layer,
        layerIndex,
    });
    
    const { value: yAccessor } = useGlobalOrLayer({
        key:"yAccessor",
        shouldUpdate: false,
        layer,
        layerIndex,
    });

    const { value: xScale } = useGlobalOrLayer({
        key:"xScale",
        layer,
        layerIndex,
    });
    
    const { value: yScale } = useGlobalOrLayer({
        key:"yScale",
        layer,
        layerIndex,
    });
    
    return {
        xScale,
        yScale,
        data,
        xAccessor,
        yAccessor,
    }
}