import React from "react";
import { Group } from "@visx/group";
import { useStore } from "../../../Store/maticoChartStore";
import { DataRow } from "../../types";
import { LayerProps } from "../LayerEngine/types";
import { Dot } from "../../Marks/Dot";
import { useGlobalOrLayer } from "../../../Hooks/useGlobalOrLayer";
import { useScatterLayerState } from "./hook";
import { ScatterLayerComponentsProps } from "./types";

export const ScatterLayer: React.FC<ScatterLayerComponentsProps> = ({ layerIndex }) => {
    const {
        data,
        xScale,
        yScale,
        xAccessor,
        yAccessor,
    } = useScatterLayerState(layerIndex);
    
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
