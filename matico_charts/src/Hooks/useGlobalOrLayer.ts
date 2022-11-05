import { useEffect } from "react";
import { MaticoChartStore, useStore } from "../Store/maticoChartStore";
import { isFunc } from "../Utils";
import { AccessorFunction, LayerSpec } from "../components/types";

export const useGlobalOrLayer = <T extends keyof MaticoChartStore>(
    layer: LayerSpec,
    layerIndex: number,
    key: T
): {
    value: MaticoChartStore[T];
    isLayer: boolean;
} => {
    const value = useStore((state) => state[key]);
    const setLayerState = useStore((state) => state.setLayerState);
    // @ts-ignore
    const layerValue = layer?.[key];
    switch (key) {
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
                layer,
                layerIndex,
                colKey as T
            );

            const accessor = useStore((state) =>
                isLayerCol
                    ? state?.layers?.[layerIndex][key as keyof LayerSpec]
                    : state[key]
            );

            useEffect(() => {
                if (isLayerCol) {
                    let accessor: AccessorFunction = (_d) => 0;
                    if (isFunc(col)) {
                        accessor = col as AccessorFunction;
                    } else if (col) {
                        accessor = (d) => d[col as string | number];
                    }
                    setLayerState({ [key]: accessor }, layerIndex);
                }
                return () =>
                    isLayerCol &&
                    setLayerState({ [key]: undefined }, layerIndex);
            }, [col]);

            return {
                value: accessor,
                isLayer: isLayerCol,
            };
        }
        // case "xScale":
        // case "yScale": {
        //     const [colKey, accessorKey, dimKey, boundsKey, axisKey] =
        //         key === "xScale"
        //             ? ["xCol", "xAccessor", "xMax", "xBounds", "xAxis"]
        //             : ["yCol", "yAccessor", "yMax", "yBounds", "yAxis"];

        //     const dimMax = useStore((state) => state[dimKey]);
        //     const bounds = useStore((state) => state[boundsKey]);
        //     const axis = useStore((state) => state[axisKey]);

        //     const axisProps = isObj(axis)
        //     ? (axis as AxisSpec)
        //     : ({
        //         display: true,
        //         position: "bottom",
        //         scaleType: "linear",
        //     } as AxisSpec);

        //     const { value: col, isLayer: isColLayer } = useGlobalOrLayer(
        //         layer,
        //         layerIndex,
        //         colKey
        //     );

        //     const { value: accessor, isLayer: isAccessorLayer } =
        //         useGlobalOrLayer(layer, layerIndex, accessorKey);

        //     useEffect(() => {
        //         if (isAccessorLayer) {
        //             let xScale;
        //             const xScaleFunc =
        //                 scaleMapping[axisProps.scaleType];
        //             if (bounds && dimMax) {
        //                 xScale = xScaleFunc<number>({
        //                     domain: bounds,
        //                     range: [0, dimMax],
        //                     clamp: true,
        //                     ...(isObj(axis)
        //                         ? (axis as AxisSpec).scaleParams
        //                         : {}),
        //                 });
        //                 setLayerState({ xScale }, layerIndex);
        //             }
        //         }

        //         return () => isAccessorLayer && setLayerState({ xScale: undefined }, layerIndex);
        //     }, [col]);

        //     return {
        //         value: accessor,
        //         isLayer: isLayerCol,
        //     };

        //     if (!isColLayer) {
        //         return {
        //             isLayer: false,
        //             value,
        //         };
        //     } else {
        //         return {
        //             isLayer: true,
        //             value: scaleMapping(col, value),
        //         };
        //     }
        // }
    }
    return layerValue !== undefined ? layerValue : value;
};
