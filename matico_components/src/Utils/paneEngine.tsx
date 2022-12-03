import React, { useLayoutEffect, useState } from "react";
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
import { MaticoLineChartPane } from "Components/Panes/MaticoLineChartPane/MaticoLineChartPane";
import { MaticoPieChartPane } from "Components/Panes/MaticoPieChartPane/MaticoPieChartPane";
import { MaticoControlsPane } from "Components/Panes/MaticoControlsPane/MaticoControlsPane";
import { MaticoContainerPane } from "Components/Panes/MaticoContainerPane/MaticoContainerPane";
import { Pane } from "Components/Panes/Pane";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { MaticoStaticMapPane } from "Components/Panes/MaticoStaticMapPane/MaticoStaticMapPane";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
// new pane schema
import { PaneParts } from "Components/Panes/PaneParts";
import { MaticoTextPaneComponents } from "Components/Panes/MaticoTextPane";
import { MaticoDateTimeSlider } from "Components/Panes/MaticoDateTimeSlider/MaticoDateTimeSlider";

export const fallbackPanes: { [paneType: string]: Pane } = {
    map: MaticoMapPane,
    staticMap: MaticoStaticMapPane,
    text: MaticoTextPane,
    histogram: MaticoHistogramPane,
    scatterplot: MaticoScatterplotPane,
    lineChart: MaticoLineChartPane,
    pieChart: MaticoPieChartPane,
    controls: MaticoControlsPane,
    container: MaticoContainerPane,
    dateTimeSlider: MaticoDateTimeSlider
};
export const panes: { [paneType: string]: PaneParts } = {
    text: MaticoTextPaneComponents
};

export const PaneSelector: React.FC<{
    paneRef: PaneRef;
    paneType: string;
    normalizedPane: any;
    updatePane: (update: any) => void;
    selectPane: () => void;
}> = ({ paneRef, paneType, normalizedPane, updatePane, selectPane }) => {
    const isEdit = useIsEditable();
    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );
    const [editComponent, setEditComponent] = useState<boolean>(false);

    useLayoutEffect(() => {
        const isCurrentEditElement = currentEditElement?.id === paneRef.id;
        if (
            isEdit &&
            isCurrentEditElement &&
            panes?.[paneType]?.["editablePane"]
        ) {
            setEditComponent(true);
        } else {
            setEditComponent(false);
        }
    }, [isEdit && currentEditElement?.id]);

    const PaneComponent =
        panes?.[paneType]?.["editablePane"] && editComponent
            ? panes[paneType]["editablePane"]
            : panes?.[paneType]?.["pane"] || fallbackPanes[paneType];

    if (!PaneComponent || !normalizedPane) return null;

    return (
        <>
            <div
                className="grid content"
                style={{ width: "100%", height: "100%" }}
            >
                <PaneComponent
                    key={normalizedPane.id}
                    position={paneRef.position}
                    {...normalizedPane}
                    paneRef={paneRef}
                    updatePane={updatePane}
                />
            </div>
        </>
    );
};
