import React, { useRef } from "react";
import styled from "styled-components";
import { PanePosition, PaneRef } from "@maticoapp/matico_types/spec";
import { View } from "@adobe/react-spectrum";
import { PaneSelector } from "Utils/paneEngine";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { useIsEditable } from "Hooks/useIsEditable";
import {
    DragEndEvent,
    useDndContext,
    useDndMonitor,
    useDraggable,
    useDroppable
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { usePane } from "Hooks/usePane";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import Move from "@spectrum-icons/workflow/Move";
import { ResizableDimensions, useResizable } from "Hooks/useResizable";
import { ParentProvider, useParentContext } from "Hooks/useParentContext";
import Resize from "@spectrum-icons/workflow/Resize";
import { updateDragOrResize } from "Utils/dragAndResize/updateDragOrResize";

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

/**
 * If the values and units are not undefined, then map over the values and units and join them together
 * with a space, for use in the style attribute.
 * @param {Array<number | undefined>} values - number[] | undefined
 * @param {Array<string | undefined>} units - string[] | undefined
 * @returns A string.
 */
const handlePositionalRule = (
    values: Array<number | undefined>,
    units: Array<string | undefined>
) => {
    if (!values || !units) {
        return "auto";
    } else {
        return values
            .map(
                (value, index) =>
                    `${value || 0}${handleUnits(units[index] || "")}`
            )
            .join(" ");
    }
};

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

const FreePane: React.FC<PanePosition & { paneRef: PaneRef }> = ({
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
    children,
    paneRef
}) => {
    const paneType = paneRef.type;
    const { normalizedPane, pane, updatePane, selectPane, updatePanePosition, parent } =
        usePane(paneRef);
    const parentDimensions = useParentContext();
    const resizableParentRef = useRef<HTMLDivElement>(null);

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
            paneId: pane.id,
            pane: normalizedPane,
            parent: parent
        }
    });

    const onDragEnd = (event: DragEndEvent) => {
        if (event.active.id === paneRef.id) {
            const prevX =
                xUnits === "percent"
                    ? (paneRef.position.x / 100) * parentDimensions.width
                    : paneRef.position.x;
            const prevY =
                yUnits === "percent"
                    ? (paneRef.position.y / 100) * parentDimensions.height
                    : paneRef.position.y;
            const { x: deltaX, y: deltaY } = event.delta;
            let newX = prevX + deltaX;
            let newY = prevY - deltaY;

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

        updateDragOrResize({
            updatePanePosition,
            widthUnits,
            heightUnits,
            xUnits,
            yUnits,
            parentDimensions,
            newX: newRect.x - parentDimensions.x,
            newY: parentDimensions.bottom - newRect.bottom,
            newWidth: newRect.width,
            newHeight: newRect.height
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
            <div
                ref={setNodeRef}
                style={{
                    boxShadow:
                        "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                    boxSizing: "border-box",
                    transform: transform
                        ? `translate(${transform.x}px, ${transform.y}px)`
                        : undefined,
                    width: `${width}${handleUnits(widthUnits)}`,
                    position: "absolute",
                    height: `${height}${handleUnits(heightUnits)}`,
                    zIndex: layer,
                    left: `${x}${handleUnits(xUnits)}`,
                    bottom: `${y}${handleUnits(yUnits)}`,
                    backgroundColor: "static-black",
                    paddingBottom: `${padBottom}${handleUnits(padUnitsBottom)}`,
                    paddingLeft: `${padLeft}${handleUnits(padUnitsLeft)}`,
                    paddingRight: `${padRight}${handleUnits(padUnitsRight)}`,
                    paddingTop: `${padTop}${handleUnits(padUnitsTop)}`
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
                    <PaneSelector
                        normalizedPane={normalizedPane}
                        updatePane={updatePane}
                        selectPane={selectPane}
                        paneRef={paneRef}
                        paneType={paneType}
                    />
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
                        <Resize
                            color="positive"
                            UNSAFE_style={{ transform: "rotate(90deg)" }}
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
            </div>
        </ParentProvider>
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
            {paneRefs
                ?.slice(0)
                .reverse()
                .map((paneRef) => (
                    <FreePane
                        key={paneRef.id}
                        {...paneRef.position}
                        paneRef={paneRef}
                    />
                ))}
        </FreeArea>
    );
};
