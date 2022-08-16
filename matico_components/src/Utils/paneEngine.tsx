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
import { useIsEditable } from "Hooks/useIsEditable";
// new pane schema
import { PaneParts } from "Components/Panes/PaneParts";
import { MaticoTextPaneComponents } from "Components/Panes/MaticoTextPane";

export const fallbackPanes: { [paneType: string]: Pane } = {
    map: MaticoMapPane,
    staticMap: MaticoStaticMapPane,
    text: MaticoTextPane,
    histogram: MaticoHistogramPane,
    scatterplot: MaticoScatterplotPane,
    pieChart: MaticoPieChartPane,
    controls: MaticoControlsPane,
    container: MaticoContainerPane
};
export const panes: { [paneType: string]: PaneParts } = {
    text: MaticoTextPaneComponents
}

export const PaneSelector: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const paneType = paneRef.type;
    const {normalizedPane, updatePane} = usePane(paneRef);
    const isEdit = useIsEditable();

    const PaneComponent = panes[paneType]?.[isEdit ? 'editablePane' : 'pane']
        || panes[paneType]?.['pane']
        || fallbackPanes[paneType];
 

    if (!PaneComponent || !normalizedPane) return null;
    return (
        //@ts-ignore
        <PaneComponent key={normalizedPane.id} position={paneRef.position} {...normalizedPane} updatePane={updatePane} />
    );
};
