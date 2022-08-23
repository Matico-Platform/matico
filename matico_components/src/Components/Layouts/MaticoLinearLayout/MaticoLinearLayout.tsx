import React, { forwardRef, useRef } from "react";
import {
    PanePosition,
    PaneRef,
    LinearLayoutDirection,
    Justification,
    Alignment,
    GapSize
} from "@maticoapp/matico_types/spec";
import { Flex } from "@adobe/react-spectrum";
import { PaneSelector } from "Utils/paneEngine";
import { usePane } from "Hooks/usePane";
import { ResizableDimensions, useResizable } from "Hooks/useResizable";
import { ParentProvider, useParentContext } from "Hooks/useParentContext";
import styled from "styled-components";
import ArrowRight from "@spectrum-icons/workflow/ArrowRight";
import ArrowDown from "@spectrum-icons/workflow/ArrowDown";
import { updateDragOrResize } from "Utils/dragAndResize/updateDragOrResize";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import MoveLeftRight from "@spectrum-icons/workflow/MoveLeftRight";
import MoveUpDown from "@spectrum-icons/workflow/MoveUpDown";
import { InternalSpecProvider, useInternalSpec } from "Hooks/useInteralSpec";
import { useIsEditable } from "Hooks/useIsEditable";
import { useMaticoSelector } from "Hooks/redux";

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

const LinearContainer: React.FC<{
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
            padBottom,
            padLeft,
            padRight,
            padTop,
            padUnitsBottom,
            padUnitsLeft,
            padUnitsRight,
            padUnitsTop
        },
        direction,
        allowOverflow
    } = useInternalSpec();

    return (
        <div
            // @ts-ignore
            ref={ref}
            style={{
                width:
                    direction === "column"
                        ? "100%"
                        : `${width}${handleUnits(
                              widthUnits,
                              "horizontal",
                              direction
                          )}`,
                height:
                    direction === "row"
                        ? "100%"
                        : `${height}${handleUnits(
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
                flexShrink: allowOverflow ? 0 : 1,
                ...style
            }}
        >
            {" "}
            {children}
        </div>
    );
});

const LinearDraggableActionWrapper: React.FC = ({ children }) => {
    const {
        updatePanePosition,
        direction,
        paneRef,
        normalizedPane,
        position: { widthUnits, heightUnits },
        parent
    } = useInternalSpec();
    const resizableParentRef = useRef<HTMLDivElement>(null);
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
            paneId: normalizedPane.id,
            pane: normalizedPane,
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

    const currentEditElement = useMaticoSelector(
        ({ spec }) => spec.currentEditElement
    );
    const isEditedPane = currentEditElement?.id === paneRef.id;

    const buttonPositionStyle =
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
              };
    const buttonVisibilityStyle = {
        opacity: isEditedPane ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: isEditedPane ? "all" : "none"
    }
    const ArrowEl = direction === "row" ? ArrowRight : ArrowDown;

    return (
        <LinearContainer
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

                <button
                    // @ts-ignore
                    style={{
                        ...buttonPositionStyle,
                        ...buttonVisibilityStyle
                    }}
                    onMouseDown={startResize}
                    aria-label="Resize Pane"
                >
                    <ArrowEl color="positive" />
                </button>
                <button 
                    // @ts-ignore
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        ...buttonVisibilityStyle
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
        </LinearContainer>
    );
};

const LinearPane: React.FC<{
    paneRef: PaneRef;
    position: PanePosition;
    allowOverflow?: boolean;
    direction?: "row" | "column";
}> = ({ position, paneRef, allowOverflow, direction }) => {
    const paneType = paneRef.type;
    const {
        normalizedPane,
        pane,
        parent,
        updatePane,
        selectPane,
        updatePanePosition
    } = usePane(paneRef);
    const isEdit = useIsEditable();
    const Wrapper = isEdit ? LinearDraggableActionWrapper : LinearContainer;

    return (
        <InternalSpecProvider
            value={{
                position,
                paneRef,
                normalizedPane,
                updatePane,
                selectPane,
                updatePanePosition,
                parent,
                direction: ["row", "column"].includes(direction)
                    ? direction
                    : "column",
                allowOverflow:
                    allowOverflow !== undefined ? allowOverflow : true
            }}
        >
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
                <ParentProvider
                    parentRef={parentRef}
                    useViewPortHeight={allowOverflow && direction === "column"}
                    useViewPortWidth={allowOverflow && direction === "row"}
                >
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
                        {paneRefs.map(
                            (paneRef: PaneRef) =>
                                !!paneRef && (
                                    <LinearPane
                                        key={paneRef.id}
                                        allowOverflow={allowOverflow}
                                        paneRef={paneRef}
                                        position={paneRef.position}
                                        direction={direction}
                                    />
                                )
                        )}
                    </Flex>
                </ParentProvider>
            </SortableContext>
        </LinearParent>
    );
};
