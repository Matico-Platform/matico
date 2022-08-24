import React, { forwardRef, useLayoutEffect, useState } from "react";
import { MaticoMapPane } from "Components/Panes/MaticoMapPane/MaticoMapPane";
import { MaticoTextPane } from "Components/Panes/MaticoTextPane/MaticoTextPane";
import { MaticoHistogramPane } from "Components/Panes/MaticoHistogramPane/MaticoHistogramPane";
import { MaticoScatterplotPane } from "Components/Panes/MaticoScatterplotPane/MaticoScatterplotPane";
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
import { useEditorActions } from "Hooks/useEditorActions";
import styled from "styled-components";
import { useMaticoContextMenu } from "Hooks/useMaticoContextMenu";

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

const Wrapper = styled.div<{ interactive?: boolean; isHovered?: boolean }>`
    padding: 0;
    border: none;
    outline: none;
    background: none;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    transition: 125ms all;
    outline: ${({ isHovered }) =>
        isHovered
            ? "4px solid var(--spectrum-global-color-chartreuse-500)"
            : "4px solid rgba(0,0,0,0)"};
    z-index: 4;
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
    children: React.ReactNode;
}> = forwardRef(({ paneRef, selectPane, normalizedPane, children }, ref) => {
    const { setHovered } = useEditorActions(paneRef.id);
    const currentHoveredRef = useMaticoSelector(
        (state) => state.editor.hoveredRef
    );
    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );

    const { ContextMenu, displayMenu } = useMaticoContextMenu({
        element: paneRef
    });
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
    const handleContext = (e: any) => {
        !isContainer && displayMenu(e);
    };

    return (
        <Wrapper
            // @ts-ignore
            ref={ref}
            onClick={handleClick}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            interactive={isInteractive}
            isHovered={isSelectedPane}
            onContextMenuCapture={handleContext}
        >
            {children}
            <ContextMenu />
        </Wrapper>
    );
});

const ComponentWrapper: React.FC<{
    paneRef: PaneRef;
    selectPane: () => void;
    normalizedPane: any;
    children?: React.ReactNode;
}> = ({ paneRef, children }) => {
    return <div data-id={paneRef.id}>{children}</div>;
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

    const WrapperComponent = isEdit ? SelectorWrapper : ComponentWrapper;

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
                paneRef={paneRef}
                updatePane={updatePane}
            />
        </WrapperComponent>
    );
};
