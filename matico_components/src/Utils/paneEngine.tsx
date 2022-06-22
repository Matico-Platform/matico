import React from 'react';
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
import { MaticoPieChartPane } from "Components/Panes/MaticoPieChartPane/MaticoPieChartPane";
import { MaticoControlsPane } from "Components/Panes/MaticoControlsPane/MaticoControlsPane";
import { MaticoContainerPane } from "Components/Panes/MaticoContainerPane/MaticoContainerPane";
import { Pane } from "Components/Panes/Pane";
import {PaneRef} from '@maticoapp/matico_types/spec';
import {useMaticoSelector} from 'Hooks/redux';

export const panes: { [paneType: string]: Pane } = {
    Map: MaticoMapPane,
    Text: MaticoTextPane,
    Histogram: MaticoHistogramPane,
    Scatterplot: MaticoScatterplotPane,
    PieChart: MaticoPieChartPane,
    Controls: MaticoControlsPane,
    Container: MaticoContainerPane
};

export function selectPane(paneRef: PaneRef) {
    const paneType = paneRef.type; 
    const pane = useMaticoSelector((state)=> state.spec.spec.panes.find((f:PaneRef)=>f.id===paneRef.id))
    const PaneComponent = panes[paneType];

    if (!PaneComponent) return null;
    return (
        <PaneComponent
            key={pane.id}
            position={paneRef.position}
            {...pane}
        />
    );
}
