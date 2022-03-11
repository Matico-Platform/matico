import React from 'react';
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
import { MaticoPieChartPane } from "Components/Panes/MaticoPieChartPane/MaticoPieChartPane";
import { MaticoControlsPane } from "Components/Panes/MaticoControlsPane/MaticoControlsPane";
import { MaticoContainerPane } from "Components/Panes/MaticoContainerPane/MaticoContainerPane";
import { Pane } from "Components/Panes/Pane";

export const panes: { [paneType: string]: Pane } = {
    Map: MaticoMapPane,
    Text: MaticoTextPane,
    Histogram: MaticoHistogramPane,
    Scatterplot: MaticoScatterplotPane,
    PieChart: MaticoPieChartPane,
    Controls: MaticoControlsPane,
    Container: MaticoContainerPane
};

export function selectPane(pane: any, editPath: string) {
    const paneType = Object.keys(pane)[0]; 
    const paneDetails = pane[paneType];
    const PaneComponent = panes[paneType];
    console.log('PANETYPE', paneType, paneDetails, PaneComponent)
    if (!PaneComponent) return null;
    return (
        <PaneComponent
            key={paneDetails.name}
            {...paneDetails}
            editPath={`${editPath}`}
        />
    );
}
