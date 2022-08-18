import React, { useLayoutEffect, useState } from "react";
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
import { MaticoStaticMapPane } from "Components/Panes/MaticoStaticMapPane/MaticoStaticMapPane";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";
// new pane schema
import { PaneParts } from "Components/Panes/PaneParts";
import { MaticoTextPaneComponents } from "Components/Panes/MaticoTextPane";
import { useEditorActions } from "Hooks/useEditorActions";
import styled from "styled-components";

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
};

const Wrapper = styled.button<{ interactive?: boolean; isHovered?: boolean }>`
    padding: 0;
    border: none;
    outline: none;
    background: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    &:after {
        box-sizing: border-box;
        content: "";
        display: block;
        clear: both;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        border: 2px solid rgba(0, 0, 0, 0);
        transition: border 125ms;
        border: ${({ isHovered }) =>
            isHovered
                ? "4px solid var(--spectrum-global-color-chartreuse-500)"
                : "4px solid rgba(0,0,0,0)"};
    }
    pointer-events: ${({ interactive }) => (interactive ? "all" : "none")};
    cursor: ${({ interactive }) => (interactive ? "pointer" : "default")};
    * {
        pointer-events: all;
    }
`;

const SelectorWrapper: React.FC<{
    paneRef: PaneRef;
    selectPane: () => void;
    normalizedPane: any;
    children?: React.ReactNode;
}> = ({ paneRef, selectPane, normalizedPane, children }) => {
    const { setHovered } = useEditorActions(paneRef.id);
    const currentHoveredRef = useMaticoSelector(
        (state) => state.editor.hoveredRef
    );
    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );
    const isEditedPane = currentEditElement?.id === paneRef.id;
    const isSelectedPane = currentHoveredRef === paneRef.id || isEditedPane;
    const isContainer = normalizedPane.type === "container";
    const isInteractive = !isContainer && !isEditedPane;

    const handleClick = () => {
        isInteractive && selectPane();
    };
    const handleHover = () => {
        isInteractive && setHovered();
    };
    const handleMouseLeave = () => {
        setHovered(null);
    };

    return (
        <Wrapper
            onClick={handleClick}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            interactive={isInteractive}
            isHovered={isSelectedPane}
        >
            {children}
        </Wrapper>
    );
};

export const PaneSelector: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const paneType = paneRef.type;
    const { normalizedPane, updatePane, selectPane } = usePane(paneRef);
    const isEdit = useIsEditable();
    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );
    const [editComponent, setEditComponent] = useState<boolean>(false);
    
    useLayoutEffect(() => {
        const isCurrentEditElement = currentEditElement?.id === paneRef.id;
        if (isEdit && isCurrentEditElement && panes?.[paneType]?.['editablePane']) {
            setEditComponent(true)        
        } else {
            setEditComponent(false)
        } 
    },[isEdit && currentEditElement?.id])

    const PaneComponent = panes?.[paneType]?.['editablePane'] && editComponent ? panes[paneType]['editablePane'] : panes?.[paneType]?.['pane'] || fallbackPanes[paneType];

    const WrapperComponent = isEdit ? SelectorWrapper : React.Fragment;

    if (!PaneComponent || !normalizedPane) return null;

    return (
        <WrapperComponent
            paneRef={paneRef}
            selectPane={selectPane}
            normalizedPane={normalizedPane}
        >
            <PaneComponent
                key={normalizedPane.id}
                position={paneRef.position}
                {...normalizedPane}
                updatePane={updatePane}
            />
        </WrapperComponent>
    );
};
