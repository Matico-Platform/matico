import { useEffect } from "react";
import { ChartStoreAndActions, useStore } from "../Store/maticoChartStore";
import { isFunc, isObj } from "../Utils";
import { AccessorFunction, AxisSpec, LayerSpec } from "../components/types";
import { AnyLayerState } from "../components/Layers/LayerEngine/types";
import { scaleMapping } from "../Utils/scaleMapping";
import { ContinuousDomain } from "@visx/scale";

export type LayerAndGlobalState = AnyLayerState & ChartStoreAndActions;

export const useGlobalOrLayer = <T extends keyof LayerAndGlobalState>(
    key: T,
    layer?: LayerSpec,
    layerIndex?: number
): {
    value: LayerAndGlobalState[T];
    isLayer: boolean;
} => {
    const value = useStore((state) => state[key as keyof ChartStoreAndActions]);
    const isLayerHook = layer && layerIndex !== undefined;
    const setLayerState = useStore((state) => state.setLayerState);
    const setGlobalState = useStore((state) => state.setState);
    const setState = isLayerHook
        ? (props: Partial<ChartStoreAndActions>) =>
              setLayerState(props, layerIndex)
        : setGlobalState;

    // @ts-ignore
    const layerValue = layer?.[key];
    switch (key) {
        case "data":
            return {
                isLayer: layerValue !== undefined,
                value: layerValue !== undefined ? layerValue : value,
            };
        case "xCol":
        case "yCol":
            return {
                isLayer: layerValue !== undefined,
                value: layerValue !== undefined ? layerValue : value,
            };
        case "xAccessor":
        case "yAccessor": {
            const colKey = key === "xAccessor" ? "xCol" : "yCol";
            const { value: col, isLayer: isLayerCol } = useGlobalOrLayer(
                colKey,
                layer,
                layerIndex
            );

            const accessor = useStore((state) =>
                isLayerHook && isLayerCol
                    ? state?.layers?.[layerIndex][key as keyof LayerSpec]
                    : state[key as keyof ChartStoreAndActions]
            );

            useEffect(() => {
                if (isLayerCol || !isLayerHook) {
                    let accessor: AccessorFunction = (_d) => 0;
                    if (isFunc(col)) {
                        accessor = col as AccessorFunction;
                    } else if (col) {
                        accessor = (d) => d[col as string | number];
                    }
                    setState({ [key]: accessor });
                }
                return () => isLayerCol && setState({ [key]: undefined });
            }, [col?.toString()]);

            return {
                value: accessor as LayerAndGlobalState[T],
                isLayer: isLayerCol,
            };
        }
        case "xBounds":
        case "yBounds": {
            const colKey = key === "xBounds" ? "xAccessor" : "yAccessor";
            const extentKey = key === "xBounds" ? "xExtent" : "yExtent";
            const { value: accessor, isLayer: isLayerAccessor } =
                useGlobalOrLayer(colKey, layer, layerIndex);
            const { value: extent, isLayer: isLayerExtent } = useGlobalOrLayer(
                extentKey,
                layer,
                layerIndex
            );
            const { value: data, isLayer: isLayerData } = useGlobalOrLayer(
                "data",
                layer,
                layerIndex
            );
            const isLayerVal = isLayerAccessor || isLayerExtent || isLayerData;

            useEffect(() => {
                if (isLayerVal || !isLayerHook) {
                    let bounds: ContinuousDomain | number[] = [0, 0];
                    if (extent) {
                        bounds = extent;
                    } else if (data && accessor) {
                        const xData: number[] = data.map(accessor);
                        bounds = [Math.min(...xData), Math.max(...xData)];
                    }
                    setState({ [key]: bounds });
                }
                return () => setState({ xBounds: undefined });
            }, [accessor?.toString(), JSON.stringify(extent)]);

            return {
                value: value as LayerAndGlobalState[T],
                isLayer: isLayerVal,
            };
        }
        case "xScale":
        case "yScale": {
            const [colKey, accessorKey, dimKey, boundsKey, axisKey] = (
                key === "xScale"
                    ? ["xCol", "xAccessor", "xMax", "xBounds", "xAxis"]
                    : ["yCol", "yAccessor", "yMax", "yBounds", "yAxis"]
            ) as (keyof ChartStoreAndActions)[];

            const { value: col, isLayer: isColLayer } = useGlobalOrLayer(
                colKey,
                layer,
                layerIndex
            );

            const { value: bounds, isLayer: isBoundsLayer } = useGlobalOrLayer(
                boundsKey,
                layer,
                layerIndex
            );

            const { value: axis, isLayer: isAxisLayer } = useGlobalOrLayer(
                boundsKey,
                layer,
                layerIndex
            );

            const { value: accessor, isLayer: isAccessorLayer } =
                useGlobalOrLayer(accessorKey, layer, layerIndex);

            const axisProps = isObj(axis)
                ? axis
                : ({
                      display: true,
                      position: "bottom",
                      scaleType: "linear",
                  } as AxisSpec);

            useEffect(() => {
                if (isAccessorLayer || isBoundsLayer || isAxisLayer) {
                    let scale;
                    const scaleFunc =
                        scaleMapping[(axisProps as AxisSpec).scaleType];
                    if (bounds && dimMax) {
                        scale = scaleFunc<any>({
                            domain: bounds,
                            range: [0, dimMax],
                            clamp: true,
                            ...(isObj(axis)
                                ? (axis as AxisSpec).scaleParams
                                : {}),
                        });
                        setState({ xScale });
                    }
                }

                return () => isAccessorLayer && setState({ xScale: undefined });
            }, [col]);
        }
        default:
            return {
                isLayer: false,
                value: value as LayerAndGlobalState[T],
            };
    }
};
