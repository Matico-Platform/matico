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
}

const Wrapper = styled.button<{interactive?: boolean}>`
    padding:0;
    border:none;
    outline:none;
    background:none;
    width:100%;
    height:100%;
    &:after {
        content: "";
        display: block;
        clear: both;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        border: 2px solid rgba(0,0,0,0);
        transition: border 125ms;
    }
    &:hover:after {
        border: ${({interactive}) => interactive ? '2px solid var(--spectrum-global-color-chartreuse-500)' : '2px solid rgba(0,0,0,0)'};
    }
    pointer-events: ${({interactive}) => interactive ? 'all' : 'none'};
    * {
        pointer-events: all;
    }
`

const SelectorWrapper: React.FC<{paneRef: PaneRef, selectPane: () => void, children?: React.ReactNode}> = ({paneRef, selectPane, children}) => {
    const {setHovered} = useEditorActions(paneRef.id)
    const currentHoveredRef = useMaticoSelector((state) => state.editor.hoveredRef);
    const { currentEditElement } = useMaticoSelector(
        (state) => state.spec
    );
    const isActiveRef = currentEditElement?.id === paneRef.id

    const handleClick = () => {
        selectPane()
    }
    const handleHover = () => {
        setHovered()
    }
    const handleMouseLeave = () => {
        setHovered(null)
    }
    
    return <Wrapper
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
        onFocus={handleClick}
        interactive={!isActiveRef}
    >
        {children}
    </Wrapper>
}

export const PaneSelector: React.FC<{ paneRef: PaneRef }> = ({ paneRef }) => {
    const paneType = paneRef.type;
    const {normalizedPane, updatePane, selectPane} = usePane(paneRef);
    const isEdit = useIsEditable();
    
    const PaneComponent = panes[paneType]?.[isEdit ? 'editablePane' : 'pane']
        || panes[paneType]?.['pane']
        || fallbackPanes[paneType];

    const WrapperComponent = isEdit ? SelectorWrapper : React.Fragment;

    if (!PaneComponent || !normalizedPane) return null;
    return (
        <WrapperComponent paneRef={paneRef} selectPane={selectPane}>
            <PaneComponent key={normalizedPane.id} position={paneRef.position} {...normalizedPane} updatePane={updatePane} />
        </WrapperComponent>
    );
};
