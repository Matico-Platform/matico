import React, { useCallback, useState } from "react";
import {
    ActionButton,
    Button,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Text,
    View
} from "@adobe/react-spectrum";
import { useApp } from "Hooks/useApp";
import {
    ContainerPane,
    Page,
    Pane,
    PaneRef
} from "@maticoapp/matico_types/spec";
import { usePage } from "Hooks/usePage";
import Delete from "@spectrum-icons/workflow/Delete";
import { withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { usePane } from "Hooks/usePane";
import { useContainer } from "Hooks/useContainer";
import {
    closestCenter,
    closestCorners,
    CollisionDescriptor,
    CollisionDetection,
    defaultDropAnimationSideEffects,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DropAnimation,
    KeyboardSensor,
    MeasuringStrategy,
    MouseSensor,
    pointerWithin,
    rectIntersection,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
    AnimateLayoutChanges,
    defaultAnimateLayoutChanges
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { NewPaneDialog } from "../EditorComponents/NewPaneDialog/NewPaneDialog";
import { IconForPaneType } from "../Utils/PaneDetails";
import { coordinateGetter } from "../EditorComponents/SortableDraggableList/multipleContainersKeyboardCoordinates";
import throttle from "lodash/throttle";
import { createPortal } from "react-dom";

// context

const DraggingContext = React.createContext({
    activeItem: null
});

const DraggingProvider: React.FC<{
    activeItem: any;
    children: React.ReactNode;
}> = ({ activeItem, children }) => {
    return (
        <DraggingContext.Provider value={activeItem}>
            {children}
        </DraggingContext.Provider>
    );
};

const useDraggingContext = () => {
    const ctx = React.useContext(DraggingContext);
    if (ctx === undefined) throw Error("Not wrapped in <DraggingProvider />.");
    return ctx;
};

const HoverableItem = styled.span`
    opacity: 0;
    transition: 125ms opacity;
`;

const HoverableRow = styled.div`
    position: relative;
`;

/**
 * Sort collisions in descending order (from greatest to smallest value)
 */
export function sortCollisionsAsc(
    { data: { value: a } }: CollisionDescriptor,
    { data: { value: b } }: CollisionDescriptor
) {
    return a - b;
}

/**
 * Returns the closest rectangles from an array of rectangles to the corners of
 * another rectangle.
 */
export const closestTop: CollisionDetection = ({
    collisionRect,
    droppableRects,
    droppableContainers,
    active
}) => {
    const activeId = active?.id;
    const top = collisionRect.top;
    const collisions: CollisionDescriptor[] = [];

    for (const droppableContainer of droppableContainers) {
        const { id } = droppableContainer;
        const rect = droppableRects.get(id);
        if (rect && id !== activeId) {
            const collisionTop = rect.top;
            const collisionMid = rect.top - rect.height / 2;
            const distance = Math.abs(collisionTop - top);

            collisions.push({
                id,
                data: {
                    droppableContainer,
                    value: distance,
                    overMid: collisionMid > top,
                    top: collisionTop
                }
            });
        }
    }

    return collisions.sort(sortCollisionsAsc);
};

const DragButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
`;

const ContainerDropTarget = styled.div<{
    active: boolean;
    isOver: boolean;
    depth: number;
}>`
    background: ${({ isOver }) =>
        isOver ? "rgba(81, 255, 249, 0.2)" : "rgba(0,0,0,0)"};
    transition: 125ms all;
    position: relative;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(81, 255, 249, 0.5);
        transition: 125ms all;
        border-left: ${({ isOver }) =>
            isOver ? "3px solid rgba(81, 255, 249, 1)" : "3px solid rgba(81, 255, 249, 0.5)"};
        opacity: ${({ active }) => (active ? "1" : "0")};
    }
`;
const DragContainer = styled.div`
    transition: 250ms box-shadow;
`;

const DraggableContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    padding: 0 1em;
    width: 100%;
    height: 2em;
    box-shadow: 0px 0px 5px 0px rgba(32, 255, 251, 0.75);
    background: rgba(0, 0, 0, 0.25);
    color: white;
    svg {
        width: 1.5em;
        margin-right: 1em;
    }
    * {
        flex-grow: 0;
    }
`;

const DraggablePane: React.FC<{
    activeItem: any;
}> = ({ activeItem }) => {
    const pane = activeItem?.data?.current?.pane;
    return (
        <DraggableContainer>
            {IconForPaneType(pane.type)}
            <Text
                UNSAFE_style={{
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    whiteSpace: "nowrap"
                }}
            >
                {pane.name}
            </Text>
        </DraggableContainer>
    );
};
const PaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
    depth: number;
    children?: React.ReactNode;
    addPaneToContainer?: (p: Pane) => void;
}> = ({ rowPane, addPaneToContainer, index, children }) => {
    const { pane, removePaneFromParent, parent, selectPane } = usePane(rowPane);
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: rowPane.id,
            data: {
                paneRefId: rowPane.id,
                paneId: pane.id,
                pane,
                parent,
                index
            }
            // getNewIndex,
        });

    const style = transform
        ? {
              transform: `translate(${transform?.x}px, ${transform?.y}px)`,
              transition
          }
        : {};

    return (
        <HoverableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <DragContainer>
                <View position="relative" width="100%">
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="start"
                        wrap="nowrap"
                    >
                        <DragButton>
                            <DragHandle color="positive" />
                        </DragButton>
                        {IconForPaneType(pane.type)}
                        <Button variant="primary" onPress={selectPane} isQuiet>
                            <Text
                                UNSAFE_style={{
                                    textOverflow: "ellipsis",
                                    overflowX: "hidden",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {pane.name}
                            </Text>
                        </Button>
                    </Flex>
                    <HoverableItem
                        style={{
                            position: "absolute",
                            zIndex: 100,
                            right: 0,
                            top: 0,
                            backgroundColor:
                                "var(--spectrum-global-color-gray-100)"
                        }}
                    >
                        {!!addPaneToContainer && (
                            <NewPaneDialog onAddPane={addPaneToContainer} />
                        )}
                        <ActionButton isQuiet onPress={removePaneFromParent}>
                            <Delete />
                        </ActionButton>
                    </HoverableItem>
                </View>
            </DragContainer>
            {children}
        </HoverableRow>
    );
};

const ContainerPaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
    depth: number;
}> = ({ rowPane, index, depth }) => {
    const { pane } = usePane(rowPane);
    const activeItem = useDraggingContext();
    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;
    const { isOver, setNodeRef } = useDroppable({
        id: pane.id,
        data: {
            targetId: pane.id,
            paneId: pane.id,
            paneRefId: rowPane.id,
            depth,
            index,
            type: "container"
        }
    });

    // @ts-ignore
    const showDropZone = !!activeItem;

    return (
        <div>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
                depth={depth}
            >
                <PaneRow
                    index={index}
                    rowPane={rowPane}
                    addPaneToContainer={addPaneToContainer}
                    depth={depth}
                />
            </ContainerDropTarget>
            <PaneList panes={panes} depth={depth + 1} />
        </div>
    );
};

const PaneList: React.FC<{
    panes: PaneRef[];
    depth?: number;
}> = ({ panes, depth = 1 }) => {
    const items = panes.map((pane) => pane.id);

    return (
        <View
            borderStartColor={"gray-500"}
            borderStartWidth={"thick"}
            marginStart="size-50"
            UNSAFE_style={{
                paddingTop: depth === 0 ? "2em" : 0
            }}
        >
            <SortableContext
                items={items}
                // strategy={verticalListSortingStrategy}
            >
                {panes.map((pane, i) => {
                    if (pane.type === "container") {
                        return (
                            <ContainerPaneRow
                                key={pane.id}
                                rowPane={pane}
                                index={i}
                                depth={depth}
                            />
                        );
                    } else {
                        return (
                            <PaneRow
                                key={pane.id}
                                rowPane={pane}
                                index={i}
                                depth={depth}
                            />
                        );
                    }
                })}
            </SortableContext>
        </View>
    );
};

interface PageListProps {
    page: Page;
}

const PageList: React.FC<PageListProps> = ({ page }) => {
    const { panes, id, name: pageName } = page;
    const { addPaneToPage, selectPage, removePage } = usePage(id);
    const activeItem = useDraggingContext();
    const depth = 0;
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            targetId: id,
            type: "page",
            depth
        }
    });
    const showDropZone = !!activeItem;

    return (
        <div style={{ position: "relative", marginTop: "2em" }}>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
                depth={depth}
            >
                <HoverableRow>
                    <Flex direction="row" justifyContent="space-between">
                        <View>
                            <Button
                                variant="primary"
                                onPress={selectPage}
                                isQuiet
                            >
                                <Text UNSAFE_style={{ paddingRight: ".5em" }}>
                                    {pageName}
                                </Text>
                            </Button>
                        </View>
                        <HoverableItem>
                            <Flex direction="row">
                                <NewPaneDialog onAddPane={addPaneToPage} />
                                <DialogTrigger
                                    isDismissable
                                    type="popover"
                                    mobileType="tray"
                                    placement="right top"
                                    containerPadding={1}
                                >
                                    <ActionButton isQuiet>
                                        <Delete />
                                    </ActionButton>
                                    {(close) => (
                                        <Dialog width="auto">
                                            <Heading>Delete {name}?</Heading>
                                            <Content marginTop="size-100">
                                                <Button
                                                    variant="negative"
                                                    onPress={() => {
                                                        removePage();
                                                        close();
                                                    }}
                                                >
                                                    <Delete /> Delete
                                                </Button>
                                            </Content>
                                        </Dialog>
                                    )}
                                </DialogTrigger>
                            </Flex>
                        </HoverableItem>
                    </Flex>
                </HoverableRow>
                <PaneList panes={panes} />
                {/* {showDropZone && <IconEl size="M" />} */}
            </ContainerDropTarget>
        </div>
    );
};

type MaticoOutlineViewerProps = RouteComponentProps & {};

type MutableList = {
    name: string;
    id: string;
    type: string;
    depth: number;
}[];

export const MaticoOutlineViewer: React.FC = withRouter(
    ({ history, location }: MaticoOutlineViewerProps) => {
        // list pages
        const { pages, reparentPane, changePaneIndex } = useApp();
        const [activeItem, setActiveItem] =
            useState<Page | PaneRef | null>(null);
        const handleDrag = throttle(
            (event: DragOverEvent | DragEndEvent, isDragEnd: boolean) => {
                const { over, active } = event;
                const isSelf = active.id === over?.id;
                if (isSelf || !over) return;
                const currentParent = active?.data?.current?.parent;
                const overParent = over?.data?.current?.parent;
                const overNewParent =
                    (over?.data?.current?.type === "page" ||
                        over?.data?.current?.type === "container") &&
                    currentParent?.id !== over?.id;
                const haveParents = currentParent && overParent;
                const overCousinRow =
                    haveParents && currentParent.id !== overParent.id;
                const isSibling =
                    haveParents && currentParent.id === overParent.id;

                if (overNewParent) {
                    const paneRefId = active?.data?.current?.paneId;
                    const targetId = over?.id as string;
                    if (isDragEnd || over?.data?.current?.depth === 0) {
                        reparentPane(paneRefId, targetId);
                    }
                    return;
                } else if (overCousinRow) {
                    const paneRefId = active?.data?.current?.paneId;
                    const targetId = overParent?.id;
                    reparentPane(paneRefId, targetId);
                    return;
                } else if (isSibling && isDragEnd) {
                    const newIndex = over?.data?.current?.index;
                    if (
                        active?.data?.current?.paneId &&
                        newIndex !== undefined
                    ) {
                        changePaneIndex(
                            active?.data?.current?.paneId,
                            newIndex
                        );
                    }
                }
            }
        );

        //@ts-ignore
        const handleDragStart = ({ active }) => setActiveItem(active);
        const handleDragOver = (event: DragOverEvent) =>
            handleDrag(event, false);
        const handleDragEnd = (event: DragEndEvent) => {
            handleDrag(event, true);
            setActiveItem(null);
        };

        const collisionDetectionStrategy: CollisionDetection = useCallback(
            (args) => {
                const { active, collisionRect } = args;
                const currentParent = active?.data?.current?.parent;
                // const currentDepth = active?.data?.current?.depth;
                const currentTop = collisionRect.top;
                // const pointerIntersections = pointerWithin(args);
                const intersections = rectIntersection(args).filter(
                    (intersected) => {
                        // Filter for not self, to avoid container dropping into itself
                        const activeId = active.id;
                        const intersectedId = intersected.id;
                        const intersectedPaneRefId =
                            intersected?.data?.droppableContainer?.data?.current
                                ?.paneRefId;
                        return (
                            activeId !== intersectedId &&
                            activeId !== intersectedPaneRefId
                        );
                    }
                );
                // todo something like this could be much more concise...
                // const nearestTops = closestTop({
                //     ...args
                // });
                // if (nearestTops.length > 1) {
                //     const nearestIsContainer =
                //         nearestTops[0]?.data?.droppableContainer?.value ===
                //         nearestTops[1]?.data?.droppableContainer?.value;
                //     if (nearestIsContainer) {
                //         const isOverMid =
                //             nearestTops[0]?.data?.droppableContainer?.overMid;
                //         if (isOverMid) {
                //             return nearestTops.filter(
                //                 (container) =>
                //                     container?.data?.current?.type !==
                //                     "container"
                //             );
                //         } else {
                //             return nearestTops.filter(
                //                 (container) =>
                //                     container?.data?.current?.type ===
                //                     "container"
                //             );
                //         }
                //     } else {
                //         return nearestTops;
                //     }
                // } else {
                //     return nearestTops;
                // }

                const parents = intersections.filter((intersected) => {
                    const intersectedData =
                        intersected?.data?.droppableContainer?.data?.current;
                    const intersectedType = intersectedData?.type;
                    const intersectedId = intersectedData?.targetId;
                    const isContainer =
                        ["page", "container"].includes(intersectedType) &&
                        intersectedId;
                    const isNewParent = intersectedId !== currentParent?.id;
                    return isContainer && isNewParent;
                });

                const siblings = intersections.filter((intersected) => {
                    const intersectedData =
                        intersected?.data?.droppableContainer?.data?.current;
                    const intersectedType = intersectedData?.type;
                    const intersectedId = intersectedData?.targetId;
                    const isContainer =
                        ["page", "container"].includes(intersectedType) &&
                        intersectedId;
                    return !isContainer;
                });
                if (!parents.length) {
                    return closestCenter({
                        ...args,
                        droppableContainers: siblings.map(
                            (item) => item.data.droppableContainer
                        )
                    });
                }
                if (!siblings.length) {
                    return closestCorners({
                        ...args,
                        droppableContainers: parents.map(
                            (item) => item.data.droppableContainer
                        )
                    });
                } else {
                    const closestSibling = closestCorners({
                        ...args,
                        droppableContainers: siblings.map(
                            (item) => item.data.droppableContainer
                        )
                    });
                    const closestParent = closestCorners({
                        ...args,
                        droppableContainers: parents.map(
                            (item) => item.data.droppableContainer
                        )
                    });
                    if (
                        parents?.length === 1 &&
                        parents[0]?.data?.droppableContainer?.data?.current
                            ?.depth === 0
                    ) {
                        return closestSibling;
                    }
                    const parentTop =
                        closestParent[0]?.data?.droppableContainer?.rect
                            ?.current?.top;
                    const parentBottom =
                        closestParent[0]?.data?.droppableContainer?.rect
                            ?.current?.bottom;
                    const parentHeight = parentBottom - parentTop;
                    const parentMid =
                        (parentTop + parentBottom) / 2 - parentHeight / 2;
                    if (parentMid < currentTop) {
                        return closestParent;
                    }
                    return closestCorners({
                        ...args,
                        droppableContainers: [...siblings, ...parents].map(
                            (item) => item.data.droppableContainer
                        )
                    });
                }
            },
            [activeItem, JSON.stringify(pages)]
        );

        const sensors = useSensors(
            useSensor(MouseSensor),
            useSensor(TouchSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter
            })
        );

        return (
            <DraggingProvider activeItem={activeItem}>
                <View width="100%" height="auto" overflow="hidden auto">
                    <Flex direction="column">
                        <Heading margin="size-150" alignSelf="start">
                            Page Outline
                        </Heading>
                        <DndContext
                            modifiers={[restrictToVerticalAxis]}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            // onDragOver={handleDragOver}
                            collisionDetection={collisionDetectionStrategy}
                            sensors={sensors}
                            // measuring={{
                            //     droppable: {
                            //         strategy: MeasuringStrategy.Always
                            //     }
                            // }}
                        >
                            {pages.map((page) => (
                                <PageList key={page.id} page={page} />
                            ))}
                            {!!activeItem &&
                                createPortal(
                                    <DragOverlay adjustScale={false}>
                                        <DraggablePane
                                            activeItem={activeItem}
                                        />
                                    </DragOverlay>,
                                    document.body
                                )}
                        </DndContext>
                    </Flex>
                </View>
            </DraggingProvider>
        );
    }
);
