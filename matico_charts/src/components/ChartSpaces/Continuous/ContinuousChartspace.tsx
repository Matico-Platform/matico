import React from "react";
import { useContinuousProps } from "../../../Hooks/useContinuousProps";
import { LayerEngine } from "../../Layers/LayerEngine";
import { SelectionArea } from "../SelectionArea/SelectionArea";

export const ContinuousChartSpace: React.FC = () => {
    const { elements } = useContinuousProps();
    return (
        <>
            <SelectionArea />
            {elements}
            <LayerEngine />
        </>
    );
};
