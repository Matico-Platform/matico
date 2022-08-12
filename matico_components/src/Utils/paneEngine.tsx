import React from "react";
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
import { MaticoPieChartPane } from "Components/Panes/MaticoPieChartPane/MaticoPieChartPane";
import { MaticoControlsPane } from "Components/Panes/MaticoControlsPane/MaticoControlsPane";
import { MaticoContainerPane } from "Components/Panes/MaticoContainerPane/MaticoContainerPane";
import { Pane } from "Components/Panes/Pane";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { usePane } from "Hooks/usePane";
import {MaticoStaticMapPane} from "Components/Panes/MaticoStaticMapPane/MaticoStaticMapPane";

export const panes: { [paneType: string]: Pane } = {
    map: MaticoMapPane,
    staticMap: MaticoStaticMapPane,
    text: MaticoTextPane,
    histogram: MaticoHistogramPane,
    scatterplot: MaticoScatterplotPane,
    pieChart: MaticoPieChartPane,
    controls: MaticoControlsPane,
    container: MaticoContainerPane
};

export const PaneSelector: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const paneType = paneRef.type;
    const {normalizedPane} = usePane(paneRef);
    const PaneComponent = panes[paneType];


    if (!PaneComponent || !normalizedPane) return null;
    return (
        //@ts-ignore
        <PaneComponent key={normalizedPane.id} position={paneRef.position} {...normalizedPane} />
    );
};
