import React from "react";
import { Group } from "@visx/group";
import { useStore } from "../../../Store/maticoChartStore";
import { DataRow } from "../../types";
import { LayerProps } from "../LayerEngine/types";
import { Dot } from "../../Marks/Dot";
import { useGlobalOrLayer } from "../../../Hooks/useGlobalOrLayer";

export const ScatterLayer: React.FC<LayerProps> = ({ layerIndex }) => {
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
    const shouldRender =
        xScale && yScale && data?.length && xAccessor && yAccessor;
    if (!shouldRender) return null;

    return (
        <Group>
            {data.map((d: DataRow, i: number) => (
                <Dot
                    index={i}
                    key={i}
                    {...{
                        xScale,
                        yScale,
                        xAccessor,
                        yAccessor,
                    }}
                />
            ))}
        </Group>
    );
};
