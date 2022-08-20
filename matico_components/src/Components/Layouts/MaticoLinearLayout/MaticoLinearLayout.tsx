import React, { useRef } from "react";
import {
    PanePosition,
    PaneRef,
    LinearLayoutDirection,
    Justification,
    Alignment,
    GapSize
} from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { ControlActionBar } from "Components/MaticoEditor/Utils/ControlActionBar";
import { PaneSelector } from "Utils/paneEngine";
import { usePane } from "Hooks/usePane";
import { ResizableDimensions, useResizable } from "Hooks/useResizable";
import { ParentProvider, useParentContext } from "Hooks/useParentContext";
import styled from "styled-components";
import Resize from "@spectrum-icons/workflow/Resize";
import { updateDragOrResize } from "Utils/dragAndResize/updateDragOrResize";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import MoveLeftRight from "@spectrum-icons/workflow/MoveLeftRight";
import MoveUpDown from "@spectrum-icons/workflow/MoveUpDown";

/**
 * If the unit is percent, return percent, otherwise return pixels.
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleHorizontalUnits = (unit: string) =>
    unit === "percent" ? "%" : "px";

/**
 * If the unit is Percent, return Viewport height, otherwise return px
 * @param {string} unit - string - This is the unit that the user has selected in the dropdown.
 */
const handleVerticalUnits = (unit: string) => (unit === "percent" ? "%" : "px");

/**
 * If the position is horizontal, then return the result of calling handleHorizontalUnits with the
 * unit, otherwise return the result of calling handleVerticalUnits with the unit.
 * @param {string} unit - string - The unit to be converted.
 * @param {'vertical' | 'horizontal'} position - 'vertical' | 'horizontal'
 */
const handleUnits = (unit: string, position: "vertical" | "horizontal") =>
    position === "horizontal"
        ? handleHorizontalUnits(unit)
        : handleVerticalUnits(unit);

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
                    `${value || 0}${handleUnits(
                        units[index] || "",
                        index % 2 === 0 ? "vertical" : "horizontal"
                    )}`
            )
            .join(" ");
    }
};

const LinearPane: React.FC<
    PanePosition & { paneRef: PaneRef; direction: string }
> = ({
    width,
    height,
    layer,
    widthUnits,
    heightUnits,
    padLeft,
    padRight,
    padBottom,
    padTop,
    padUnitsLeft,
    padUnitsRight,
    padUnitsBottom,
    padUnitsTop,
    paneRef,
    direction
}) => {
    const paneType = paneRef.type;
    const resizableParentRef = useRef<HTMLDivElement>(null);
    const {
        normalizedPane,
        pane,
        parent,
        updatePane,
        selectPane,
        updatePanePosition
    } = usePane(paneRef);
    const {
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners,
        transform
    } = useSortable({
        id: paneRef.id,
        data: {
            paneRefId: paneRef.id,
            paneId: pane.id,
            pane,
            parent
        }
    });

    const parentDimensions = useParentContext();
    const onResizeEnd = (event: ResizableDimensions) => {
        const newRect = event.newRect;
        updateDragOrResize({
            updatePanePosition,
            widthUnits,
            heightUnits,
            xUnits: widthUnits,
            yUnits: heightUnits,
            parentDimensions,
            newWidth: direction === "row" ? newRect.width : undefined,
            newHeight: direction === "column" ? newRect.height : undefined
        });
    };

    const {
        active: resizeActive,
        startResize,
        indicatorStyles
    } = useResizable({
        ref: resizableParentRef,
        orientation: direction === "row" ? "horizontal" : "vertical",
        onResizeEnd
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1),3px -7px 15px -3px rgba(0,0,0,0.05)",
                boxSizing: "border-box",
                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined,
                width:
                    direction === "column"
                        ? "100%"
                        : `${width}${handleHorizontalUnits(widthUnits)}`,
                height:
                    direction === "row"
                        ? "100%"
                        : `${height}${handleVerticalUnits(heightUnits)}`,
                zIndex: layer,
                backgroundColor: "static-black",
                paddingBottom: `${padBottom}${handleVerticalUnits(
                    padUnitsBottom
                )}`,
                paddingLeft: `${padLeft}${handleVerticalUnits(padUnitsLeft)}`,
                paddingRight: `${padRight}${handleVerticalUnits(
                    padUnitsRight
                )}`,
                paddingTop: `${padTop}${handleVerticalUnits(padUnitsTop)}`,
                maxWidth: "100%"
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

                <button
                    style={
                        direction === "row"
                            ? {
                                  position: "absolute",
                                  right: 0,
                                  bottom: "50%",
                                  transform: "translate(0, 50%)"
                              }
                            : {
                                  position: "absolute",
                                  right: "50%",
                                  bottom: 0,
                                  transform: "translate(50%, 0)"
                              }
                    }
                    onMouseDown={startResize}
                    aria-label="Resize Pane"
                >
                    <Resize
                        color="positive"
                        UNSAFE_style={{
                            transform: `rotate(${
                                direction === "row" ? 45 : 135
                            }deg)`
                        }}
                    />
                </button>
                <button
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, 0)"
                    }}
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    aria-label="Move Pane"
                >
                    {direction === "row" ? (
                        <MoveLeftRight color="positive" />
                    ) : (
                        <MoveUpDown color="positive" />
                    )}
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
    );
};

export interface MaticoLinearLayoutInterface {
    paneRefs: Array<PaneRef>;
    paneRef?: PaneRef;
    direction: LinearLayoutDirection;
    align: Alignment;
    justify: Justification;
    gap?: GapSize;
}

const GapVals = {
    none: "size-0",
    small: "size-100",
    medium: "size-600",
    large: "size-1000"
};

const LinearParent = styled.div`
    width: 100%;
    height: 100%;
`;

export const MaticoLinearLayout: React.FC<MaticoLinearLayoutInterface> = ({
    paneRefs,
    direction,
    align,
    justify,
    gap
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    return (
        <LinearParent ref={parentRef}>
            <SortableContext items={paneRefs.map((f) => f.id)}>
                <ParentProvider parentRef={parentRef}>
                    <Flex
                        position="relative"
                        width="100%"
                        height="100%"
                        direction={direction}
                        alignContent={align}
                        justifyContent={justify}
                        gap={GapVals[gap]}
                    >
                        {paneRefs.map((paneRef: PaneRef) => (
                            <LinearPane
                                key={paneRef.id}
                                paneRef={paneRef}
                                direction={direction}
                                {...paneRef.position}
                            />
                        ))}
                    </Flex>
                </ParentProvider>
            </SortableContext>
        </LinearParent>
    );
};
