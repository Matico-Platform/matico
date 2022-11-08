import { useGlobalOrLayer } from "../../../Hooks/useGlobalOrLayer";
import { useStore } from "../../../Store/maticoChartStore";
import { ScatterLayerState } from "./types";

export function useScatterLayerState(layerIndex: number): ScatterLayerState {
    const layer = useStore((state) => state?.layers?.[layerIndex])!;

    const { value: data } = useGlobalOrLayer(
        "data",
        layer,
        layerIndex,
    )

    const { value: xAccessor } = useGlobalOrLayer(
        "xAccessor",
        layer,
        layerIndex,
    );
    
    const { value: yAccessor } = useGlobalOrLayer(
        "yAccessor",
        layer,
        layerIndex,
    );

    const { value: xScale } = useGlobalOrLayer(
        "xScale",
        layer,
        layerIndex,
    );
    
    const { value: yScale } = useGlobalOrLayer(
        "yScale",
        layer,
        layerIndex,
    );
    
    return {
        xScale,
        yScale,
        data,
        xAccessor,
        yAccessor,
    }
}