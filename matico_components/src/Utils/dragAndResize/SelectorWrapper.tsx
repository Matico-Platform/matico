import React, { forwardRef } from "react";
import { PaneRef } from "@maticoapp/matico_types/spec";
import { useMaticoSelector } from "Hooks/redux";
// new pane schema
import { useEditorActions } from "Hooks/useEditorActions";
import styled from "styled-components";
import { useMaticoContextMenu } from "Hooks/useMaticoContextMenu";

const Wrapper = styled.span<{ interactive?: boolean; isHovered?: boolean }>`
    box-sizing: border-box;
    transition: 125ms all;
    outline: ${({ isHovered }) =>
        isHovered
            ? "4px solid var(--spectrum-global-color-chartreuse-500)"
            : "4px solid rgba(0,0,0,0)"};
    z-index: 4;
    margin: 4px;
    box-sizing: border-box;
    pointer-events: ${({ interactive }) => (interactive ? "all" : "none")};
    cursor: ${({ interactive }) => (interactive ? "pointer" : "default")};
    * {
        pointer-events: all;
    }
`;

export const SelectorWrapper: React.FC<{
    paneRef: PaneRef;
    selectPane: () => void;
    normalizedPane: any;
    style?: React.CSSProperties;
}> = forwardRef(({ paneRef, selectPane, normalizedPane, style = {} }, ref) => {
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
    const isContainer = normalizedPane?.type === "container";
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
            className="grid wrapper"
            // @ts-ignore
            ref={ref}
            onClick={handleClick}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            interactive={isInteractive}
            isHovered={isSelectedPane}
            onContextMenuCapture={handleContext}
            style={style}
            role="button"
        >
            <ContextMenu />
        </Wrapper>
    );
});
