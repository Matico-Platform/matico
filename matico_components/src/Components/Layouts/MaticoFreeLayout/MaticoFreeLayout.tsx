import React, { forwardRef, useRef } from "react";
import styled from "styled-components";
import { PanePosition, PaneRef } from "@maticoapp/matico_types/spec";
import { PaneSelector } from "Utils/paneEngine";
import { DragEndEvent, useDndMonitor, useDraggable } from "@dnd-kit/core";
import { usePane } from "Hooks/usePane";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { ResizableDimensions, useResizable } from "Hooks/useResizable";
import { ParentProvider, useParentContext } from "Hooks/useParentContext";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import { updateDragOrResize } from "Utils/dragAndResize/updateDragOrResize";
import { useIsEditable } from "Hooks/useIsEditable";
import { InternalSpecProvider, useInternalSpec } from "Hooks/useInteralSpec";

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


const DraggableButton = styled.button`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    background: var(--spectrum-global-color-gray-100);
    border: none;
    justify-content: center;
    align-items: center;
    padding: 1em 0;
    opacity: 0.5;
    cursor: grab;
    &:hover {
        opacity: 1;
    }
    &:active {
        cursor: grabbing;
    }
`;

const FreeContainer: React.FC<{
    ref?: any;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}> = forwardRef(({style,children}, ref) => {
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
            padUnitsTop,
        }
    } = useInternalSpec()
    const parentDimensions = useParentContext();
    
    const styleWidth = Math.min(width, widthUnits === "percent" ? 100 : parentDimensions.width);
    const styleHeight = Math.min(height, heightUnits === "percent" ? 100 : parentDimensions.height);
    const styleLeft = Math.max(0, Math.min(
        x,
        xUnits === "percent" ? 100 - styleWidth : parentDimensions.width - styleWidth
    ))
    const styleTop = Math.max(0, Math.min(
        y,
        yUnits === "percent" ? 100 - styleHeight : parentDimensions.height - styleHeight
    ))

    return <div
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
    </div>;
})


const FreeDraggableActionWrapper: React.FC<{
        children?: React.ReactNode;
    }
> = ({
    children
}) => {
    const parentDimensions = useParentContext();
    const resizableParentRef = useRef<HTMLDivElement>(null);
    const {
        paneRef,
        normalizedPane,
        updatePanePosition,
        parent,
        position: {
            width,
            height,
            x,
            y,
            xUnits,
            yUnits,
            widthUnits,
            heightUnits,
        }
    } = useInternalSpec();

    const {
        attributes,
        listeners,
        setNodeRef,
        node: droppableRef,
        setActivatorNodeRef,
        transform
    } = useDraggable({
        id: paneRef.id,
        data: {
            paneRefId: paneRef.id,
            paneId: normalizedPane.id,
            pane: normalizedPane,
            parent: parent
        }
    });

    const onDragEnd = (event: DragEndEvent) => {
        if (event)
            if (event.active.id === paneRef.id) {
                const prevX =
                    xUnits === "percent"
                        ? (x / 100) * parentDimensions.width
                        : x;
                const prevY =
                    yUnits === "percent"
                        ? (y / 100) * parentDimensions.height
                        : y;

                const prevWidth =
                        widthUnits === "percent"
                            ? (width / 100) * parentDimensions.width
                            : width;
                const prevHeight =
                        heightUnits === "percent"
                            ? (height / 100) * parentDimensions.height
                            : height;
    
                const { x: deltaX, y: deltaY } = event.delta;
                
                let newX = Math.max(
                    0, 
                    Math.min(
                        prevX + deltaX,
                        parentDimensions.width - prevWidth
                    )
                )
                let newY = Math.max(
                    0, 
                    Math.min(
                        prevY + deltaY,
                        parentDimensions.height - prevHeight
                    )
                )

                updateDragOrResize({
                    updatePanePosition,
                    widthUnits,
                    heightUnits,
                    xUnits,
                    yUnits,
                    parentDimensions,
                    newX,
                    newY
                });
            }
    };

    const onResizeEnd = (event: ResizableDimensions) => {
        const newRect = event.newRect;
        const newWidth = Math.min(newRect.width, parentDimensions.width);
        const newHeight = Math.min(newRect.height, parentDimensions.height);
        let newX = Math.max(
            0, 
            Math.min(
                newRect.x - parentDimensions.x,
                parentDimensions.width - newWidth
            )
        )
        let newY = Math.max(
            0, 
            Math.min(
                newRect.y - parentDimensions.y,
                parentDimensions.height - newHeight
            )
        )
        updateDragOrResize({
            updatePanePosition,
                widthUnits,
                heightUnits,
                xUnits,
                yUnits,
                parentDimensions,
                newX,
                newY,
                newWidth,
                newHeight
        });
    };

    useDndMonitor({
        onDragEnd
    });

    const {
        active: resizeActive,
        startResize,
        indicatorStyles
    } = useResizable({
        ref: resizableParentRef,
        onResizeEnd
    });

    return (
        <ParentProvider parentRef={droppableRef}>
            <FreeContainer
                ref={setNodeRef}
                style={{
                    transform: transform
                        ? `translate(${transform.x}px, ${transform.y}px)`
                        : undefined
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%"
                    }}
                    ref={resizableParentRef}
                >
                    {children}
                    <DraggableButton
                        {...listeners}
                        {...attributes}
                        ref={setActivatorNodeRef}
                        style={{
                            zIndex: 10
                        }}
                        aria-label="Drag Pane"
                    >
                        <DragHandle color="positive" size="M" />
                    </DraggableButton>
                    <button
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            zIndex: 10
                        }}
                        onMouseDown={startResize}
                        aria-label="Resize Pane"
                    >
                        <ArrowRight
                            color="positive"
                            UNSAFE_style={{ transform: "rotate(45deg)" }}
                        />
                    </button>

                    {!!resizeActive && (
                        <span
                            style={{
                                ...indicatorStyles,
                                zIndex: 5,
                                background: "#33ab8455"
                            }}
                        >
                            {" "}
                        </span>
                    )}
                </div>
            </FreeContainer>
        </ParentProvider>
    );
};

const FreePane: React.FC<{position: PanePosition, paneRef: PaneRef }> = ({
    paneRef,
    position
}) => {
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
    const Wrapper = isEdit ? FreeDraggableActionWrapper : FreeContainer;

    return (
        <InternalSpecProvider value={{
            position,
            paneRef,
            normalizedPane,
            updatePane,
            selectPane,
            updatePanePosition,
            parent
        }}>
            <Wrapper>
                <PaneSelector
                    normalizedPane={normalizedPane}
                    updatePane={updatePane}
                    selectPane={selectPane}
                    paneRef={paneRef}
                    paneType={paneType}
                />
            </Wrapper>
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
    return (
        <FreeArea>
            {paneRefs // reverse to make the order on the outline reflect render order
                ?.slice(0)
                .reverse()
                .map((paneRef) => (
                    <FreePane
                        key={paneRef.id}
                        position={paneRef.position}
                        paneRef={paneRef}
                    />
                ))}
        </FreeArea>
    );
};
