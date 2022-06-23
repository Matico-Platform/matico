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
import {usePane} from 'Hooks/usePane';

export const panes: { [paneType: string]: Pane } = {
    map: MaticoMapPane,
    text: MaticoTextPane,
    histogram: MaticoHistogramPane,
    scatterplot: MaticoScatterplotPane,
    pieChart: MaticoPieChartPane,
    controls: MaticoControlsPane,
    container: MaticoContainerPane
};

export function selectPane(paneRef: PaneRef) {
    const paneType = paneRef.type; 
    const {pane} = usePane(paneRef)
    const PaneComponent = panes[paneType];
    console.log("pane type ", paneRef.type, PaneComponent)
    

    if (!PaneComponent) return null;
    return (
        <PaneComponent
            key={pane.id}
            position={paneRef.position}
            {...pane}
        />
    );
}
