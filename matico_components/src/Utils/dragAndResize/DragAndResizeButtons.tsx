import React, {
    useEffect,
    useLayoutEffect,
    useRef,
} from "react";
import styled from "styled-components";
import { DragEndEvent, useDndMonitor, useDraggable } from "@dnd-kit/core";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { ResizableDimensions, useResizable } from "Hooks/useResizable";
import { useParentContext } from "Hooks/useParentContext";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import { updateDragOrResize } from "Utils/dragAndResize/updateDragOrResize";
import { useInternalSpec } from "Hooks/useInteralSpec";
import { useMaticoSelector } from "Hooks/redux";
import { SelectorWrapper } from "./SelectorWrapper";
import MoveLeftRight from "@spectrum-icons/workflow/MoveLeftRight";
import MoveUpDown from "@spectrum-icons/workflow/MoveUpDown";
import ArrowDown from "@spectrum-icons/workflow/ArrowDown";
import { useSortable } from "@dnd-kit/sortable";

const DraggableButton = styled.button`
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

export const DragAndResizeActionButtons: React.FC<{
    paneContainerRef: React.RefObject<HTMLElement>;
    layoutType: string;
}> = ({ paneContainerRef, layoutType }) => {
    const parentDimensions = useParentContext();
    const resizableParentRef = useRef<HTMLDivElement>(null);
    const {
        paneRef,
        selectPane,
        normalizedPane,
        updatePanePosition,
        parent,
        direction,
        position: {
            width,
            height,
            x,
            y,
            xUnits,
            yUnits,
            widthUnits,
            heightUnits
        }
    } = useInternalSpec();

    const {
        attributes: dragAttributes,
        listeners: draggableListeners,
        setNodeRef: setDraggableNodeRef,
        setActivatorNodeRef: setDraggableActivator,
        transform: dragTransform
    } = useDraggable({
        id: paneRef?.id,
        data: {
            paneRefId: paneRef?.id,
            paneId: normalizedPane?.id,
            pane: normalizedPane,
            parent: parent
        }
    });

    const {
        setNodeRef: setSortableNodeRef,
        setActivatorNodeRef: setSortableActivator,
        attributes: sortableAttributes,
        listeners: sortableListeners,
        transform: sortableTransform,
    } = useSortable({
        id: paneRef?.id,
        data: {
            paneRefId: paneRef?.id,
            paneId: normalizedPane?.id,
            pane: normalizedPane,
            parent
        }
    });

    const listeners = layoutType === "linear"
        ? sortableListeners
        : draggableListeners;

    const attributes = layoutType === "linear"
        ? sortableAttributes
        : dragAttributes;

    const setActivatorNodeRef = layoutType === "linear"
        ? setSortableActivator
        : setDraggableActivator;

    const transform = layoutType === "linear"
        ? sortableTransform
        : dragTransform;

    const onDragEnd = (event: DragEndEvent) => {
        if (event && event.active.id === paneRef.id) {
            const prevX =
                xUnits === "percent" ? (x / 100) * parentDimensions.width : x;
            const prevY =
                yUnits === "percent" ? (y / 100) * parentDimensions.height : y;

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
                Math.min(prevX + deltaX, parentDimensions.width - prevWidth)
            );
            let newY = Math.max(
                0,
                Math.min(prevY + deltaY, parentDimensions.height - prevHeight)
            );

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
        switch (layoutType) {
            case "free": {
                const newWidth = Math.min(
                    newRect.width,
                    parentDimensions.width
                );
                const newHeight = Math.min(
                    newRect.height,
                    parentDimensions.height
                );
                let newX = Math.max(
                    0,
                    Math.min(
                        newRect.x - parentDimensions.x,
                        parentDimensions.width - newWidth
                    )
                );
                let newY = Math.max(
                    0,
                    Math.min(
                        newRect.y - parentDimensions.y,
                        parentDimensions.height - newHeight
                    )
                );
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
            }
            case "linear": {
                updateDragOrResize({
                    updatePanePosition,
                    widthUnits,
                    heightUnits,
                    xUnits: widthUnits,
                    yUnits: heightUnits,
                    parentDimensions,
                    newWidth: direction === "row" ? newRect.width : undefined,
                    newHeight:
                        direction === "column" ? newRect.height : undefined
                });
            }
        }
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
        orientation:
            layoutType === "linear"
                ? direction === "row"
                    ? "horizontal"
                    : "vertical"
                : "both",
        onResizeEnd
    });

    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );
    const isEditedPane = currentEditElement?.id === paneRef.id;

    const buttonVisibilityStyle = {
        opacity: isEditedPane ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: isEditedPane ? "all" : "none"
    };

    const ArrowEl =
        layoutType !== "linear" || direction === "row" ? ArrowRight : ArrowDown;

    useEffect(() => {
        if (transform?.x !== undefined && resizableParentRef?.current) {
            paneContainerRef.current.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
        } else {
            paneContainerRef.current.style.transform = "";
        }
    }, [transform?.x, transform?.y]);

    useLayoutEffect(() => {
        if (paneContainerRef?.current) {
            if (layoutType === "linear") {
                setSortableNodeRef(paneContainerRef.current);
            } else {
                setDraggableNodeRef(paneContainerRef.current);
            }
        }
    }, [!!paneContainerRef?.current, layoutType, setSortableNodeRef?.toString(), setDraggableNodeRef?.toString()]);

    return (
        <>
            <SelectorWrapper
                paneRef={paneRef}
                selectPane={selectPane}
                normalizedPane={normalizedPane}
                // @ts-ignore
                ref={resizableParentRef}
            />
            <DraggableButton
                {...listeners}
                {...attributes}
                ref={setActivatorNodeRef}
                style={{
                    zIndex: 10,
                    opacity: isEditedPane ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                    // @ts-ignore
                    pointerEvents: isEditedPane ? "all" : "none",
                    ...buttonVisibilityStyle
                }}
                aria-label="Drag Pane"
                className={`grid center sm ${
                    direction === "row" || layoutType !== "linear" ? "w" : "n"
                }`}
            >
                {layoutType === "free" ? (
                    <DragHandle color="positive" size="M" />
                ) : direction === "row" ? (
                    <MoveLeftRight color="positive" />
                ) : (
                    <MoveUpDown color="positive" />
                )}
            </DraggableButton>
            <button
                style={{
                    zIndex: 10,
                    opacity: isEditedPane ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                    pointerEvents: isEditedPane ? "all" : "none"
                }}
                onMouseDown={startResize}
                aria-label="Resize Pane"
                className={`grid sm ${layoutType === "free" ? " s e " : direction === "row" ? "center e" : "center s"}`}
            >
                <ArrowEl
                    color="positive"
                    UNSAFE_style={{
                        transform: layoutType === "free" ? "rotate(45deg)" : ""
                    }}
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
        </>
    );
};
