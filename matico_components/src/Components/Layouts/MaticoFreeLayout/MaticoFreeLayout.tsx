import React, { forwardRef, useRef } from "react";
import styled from "styled-components";
import { PanePosition, PaneRef } from "@maticoapp/matico_types/spec";
import { PaneSelector } from "Utils/paneEngine";
import { usePane } from "Hooks/usePane";
import { ParentProvider, useParentContext } from "Hooks/useParentContext";
import { useIsEditable } from "Hooks/useIsEditable";
import { InternalSpecProvider, useInternalSpec } from "Hooks/useInteralSpec";
import { PaneGrid } from "Utils/paneGrid";
import { DragAndResizeActionButtons } from "Utils/dragAndResize/DragAndResizeButtons";

const FreeArea = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
`;
/**
 * If the unit is Percent, return %, otherwise return px.
 * @param {string} unit - The unit of the value.
 */
const handleUnits = (unit: string) => (unit === "percent" ? "%" : "px");

const FreeContainer: React.FC<{
    ref?: any;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}> = forwardRef(({ style, children }, ref) => {
    const {
        position: {
            width,
            height,
            layer,
            widthUnits,
            heightUnits,
            x,
            xUnits,
            y,
            yUnits,
            padBottom,
            padLeft,
            padRight,
            padTop,
            padUnitsBottom,
            padUnitsLeft,
            padUnitsRight,
            padUnitsTop
        }
    } = useInternalSpec();
    const parentDimensions = useParentContext();

    const styleWidth = Math.min(
        width,
        widthUnits === "percent" ? 100 : parentDimensions.width
    );
    const styleHeight = Math.min(
        height,
        heightUnits === "percent" ? 100 : parentDimensions.height
    );
    let normalizedWidth =
        xUnits === widthUnits
            ? styleWidth
            : xUnits === "pixels"
            ? (styleWidth / 100) * parentDimensions.width
            : (styleWidth / parentDimensions.width) * 100;

    let normalizedHeight =
        yUnits === heightUnits
            ? styleHeight
            : yUnits === "pixels"
            ? (styleHeight / 100) * parentDimensions.height
            : (styleHeight / parentDimensions.height) * 100;

    const styleLeft = Math.max(
        0,
        Math.min(
            x,
            xUnits === "percent"
                ? 100 - normalizedWidth
                : parentDimensions.width - normalizedWidth
        )
    );

    const styleTop = Math.max(
        0,
        Math.min(
            y,
            yUnits === "percent"
                ? 100 - normalizedHeight
                : parentDimensions.height - normalizedHeight
        )
    );

    return (
        <PaneGrid
            // @ts-ignore
            ref={ref}
            style={{
                boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                boxSizing: "border-box",
                width: `${styleWidth}${handleUnits(widthUnits)}`,
                position: "absolute",
                height: `${styleHeight}${handleUnits(heightUnits)}`,
                zIndex: layer,
                left: `${styleLeft}${handleUnits(xUnits)}`,
                top: `${styleTop}${handleUnits(yUnits)}`,
                backgroundColor: "static-black",
                paddingBottom: `${padBottom}${handleUnits(padUnitsBottom)}`,
                paddingLeft: `${padLeft}${handleUnits(padUnitsLeft)}`,
                paddingRight: `${padRight}${handleUnits(padUnitsRight)}`,
                paddingTop: `${padTop}${handleUnits(padUnitsTop)}`,
                ...style
            }}
        >
            {children}
        </PaneGrid>
    );
});

const FreePane: React.FC<{ position: PanePosition; paneRef: PaneRef }> = ({
    paneRef,
    position
}) => {
    const paneContainerRef = useRef<HTMLDivElement>(null);
    const paneType = paneRef.type;

    const {
        normalizedPane,
        pane,
        updatePane,
        selectPane,
        updatePanePosition,
        parent
    } = usePane(paneRef);

    const isEdit = useIsEditable();

    return (
        <InternalSpecProvider
            value={{
                position,
                paneRef,
                normalizedPane,
                updatePane,
                selectPane,
                updatePanePosition,
                parent
            }}
        >
            <FreeContainer ref={paneContainerRef}>
                {!!isEdit && (
                    <DragAndResizeActionButtons
                        paneContainerRef={paneContainerRef}
                        layoutType="free"
                    />
                )}
                <PaneSelector
                    normalizedPane={normalizedPane}
                    updatePane={updatePane}
                    selectPane={selectPane}
                    paneRef={paneRef}
                    paneType={paneType}
                />
            </FreeContainer>
        </InternalSpecProvider>
    );
};

export interface MaticoFreeLayoutInterface {
    paneRefs: Array<PaneRef>;
    paneRef?: PaneRef;
}

export const MaticoFreeLayout: React.FC<MaticoFreeLayoutInterface> = ({
    paneRefs
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    return (
        <FreeArea ref={parentRef}>
            <ParentProvider parentRef={parentRef}>
                {paneRefs // reverse to make the order on the outline reflect render order
                    ?.slice(0)
                    .reverse()
                    .map(
                        (paneRef) =>
                            !!paneRef && (
                                <FreePane
                                    key={paneRef.id}
                                    position={paneRef.position}
                                    paneRef={paneRef}
                                />
                            )
                    )}
            </ParentProvider>
        </FreeArea>
    );
};
