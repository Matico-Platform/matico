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

type UnitTree = {
    [position: string]: {
        [direction: string]: {
            [unit: string]: string;
        };
    };
};

const unitTree: UnitTree = {
    vertical: {
        row: {
            percent: "%"
        },
        column: {
            percent: "vh"
        }
    },
    horizontal: {
        row: {
            percent: "vw"
        },
        column: {
            percent: "%"
        }
    }
};
/**
 * If the position is horizontal, then return the result of calling handleHorizontalUnits with the
 * unit, otherwise return the result of calling handleVerticalUnits with the unit.
 * @param {string} unit - string - The unit to be converted.
 * @param {'vertical' | 'horizontal'} position - 'vertical' | 'horizontal'
 * @param {'row | 'column'} direction - 'row' | 'column'
 */
const handleUnits = (
    unit: string,
    position: "vertical" | "horizontal",
    direction: "row" | "column"
) => {
    if (unit === "pixels") {
        return "px";
    } else {
        return unitTree[position][direction][unit];
    }
};

/**
 * If the values and units are not undefined, then map over the values and units and join them together
 * with a space, for use in the style attribute.
 * @param {Array<number | undefined>} values - number[] | undefined
 * @param {Array<string | undefined>} units - string[] | undefined
 * @returns A string.
 */
const handlePositionalRule = (
    values: Array<number | undefined>,
    units: Array<string | undefined>,
    direction: "row" | "column"
) => {
    if (!values || !units) {
        return "auto";
    } else {
        return values
            .map(
                (value, index) =>
                    `${value || 0}${handleUnits(
                        units[index] || "",
                        index % 2 === 0 ? "vertical" : "horizontal",
                        direction
                    )}`
            )
            .join(" ");
    }
};

const LinearPane: React.FC<
    PanePosition & {
        paneRef: PaneRef;
        allowOverflow?: boolean;
        direction?: "row" | "column";
    }
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
    allowOverflow,
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
                width: `${width}${handleUnits(
                    widthUnits,
                    "horizontal",
                    direction
                )}`,
                height: `${height}${handleUnits(
                    heightUnits,
                    "vertical",
                    direction
                )}`,
                maxWidth: "100%",
                zIndex: layer,
                paddingBottom: `${padBottom}${handleUnits(
                    padUnitsBottom,
                    "vertical",
                    direction
                )}`,
                paddingLeft: `${padLeft}${handleUnits(
                    padUnitsLeft,
                    "horizontal",
                    direction
                )}`,
                paddingRight: `${padRight}${handleUnits(
                    padUnitsRight,
                    "horizontal",
                    direction
                )}`,
                paddingTop: `${padTop}${handleUnits(
                    padUnitsTop,
                    "vertical",
                    direction
                )}`,

                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined,
                flexShrink: allowOverflow ? 0 : 1
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
    allowOverflow?: boolean;
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
    gap,
    allowOverflow
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    return (
        <LinearParent
            ref={parentRef}
            style={{
                overflow: `${
                    allowOverflow && direction === "row" ? "auto" : "hidden"
                } ${
                    allowOverflow && direction === "column" ? "auto" : "hidden"
                }`
            }}
        >
            <SortableContext items={paneRefs.map((f) => f.id)}>
                <ParentProvider parentRef={parentRef}>
                    <Flex
                        id="layout-engine"
                        position="relative"
                        width={
                            allowOverflow && direction === "row"
                                ? "fit-content"
                                : "100%"
                        }
                        height={
                            allowOverflow && direction === "column"
                                ? "fit-content"
                                : "100%"
                        }
                        direction={direction}
                        alignContent={align}
                        justifyContent={justify}
                        gap={GapVals[gap]}
                    >
                        {paneRefs.map((paneRef: PaneRef) => (
                            <LinearPane
                                key={paneRef.id}
                                allowOverflow={allowOverflow}
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
