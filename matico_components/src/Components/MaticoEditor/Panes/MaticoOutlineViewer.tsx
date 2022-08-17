import React, { useCallback, useState } from "react";
import {
    ActionButton,
    Button,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Item,
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
    CollisionDetection,
    DndContext,
    KeyboardSensor,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    arrayMove,
    useSortable,
    SortableContext,
    sortableKeyboardCoordinates,
    SortingStrategy,
    verticalListSortingStrategy,
    AnimateLayoutChanges,
    NewIndexGetter,
    defaultAnimateLayoutChanges
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import DragHandle from "@spectrum-icons/workflow/DragHandle";
import { NewPaneDialog } from "../EditorComponents/NewPaneDialog/NewPaneDialog";
import { IconForPaneType } from "../Utils/PaneDetails";
import { MultipleContainers } from "../EditorComponents/SortableDraggableList/MultipleContainers";
import { coordinateGetter } from "../EditorComponents/SortableDraggableList/multipleContainersKeyboardCoordinates";

// function addForContainer(container: ContainerPane, inset: number) {
//   let containerPanes: Array<RowEntryMultiButtonProps> = [];

//   rowComponents.push(
//     {
//       entryName: page.name,
//       inset: inset,
//       compact: true,
//       onSelect: () => setEditPage(page.id),
//       onRemove: () => removePage(page.id),
//       onRaise: () => { },
//       onLower: () => { },
//       onDuplicate: () => { }
//     }

//   )
//   inset += 1
// }

const HoverableItem = styled.span`
    opacity: 0;
    transition: 125ms opacity;
`;

const HoverableRow = styled.span`
    :hover {
        background: #cc00007f;
    }
    &:hover ${HoverableItem} {
        opacity: 1;
    }
`;

const DragButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: grab;
`;

const DragContainer = styled.div`
    transition: 250ms box-shadow;
`;

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({...args, wasDragging: true});

const PaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
    addPaneToContainer?: (p: Pane) => void;
}> = ({ rowPane, addPaneToContainer, index }) => {
    const {
        pane,
        updatePane,
        removePane,
        removePaneFromParent,
        updatePanePosition,
        parent,
        raisePane,
        lowerPane,
        setPaneOrder,
        selectPane
    } = usePane(rowPane);

    const {
        active,
        attributes,
        isDragging,
        isSorting,
        listeners,
        overIndex,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: pane.id,
        data: {
            paneRefId: pane.id,
            parent,
            index: index
        },
        animateLayoutChanges
        // getNewIndex,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              background: "var(--spectrum-global-color-static-gray-900)",
              boxShadow:
                  "0px 0px 10px var(--spectrum-global-color-fuchsia-400)",
              cursor: "grabbing",
              zIndex: 500
          }
        : undefined;

    return (
        <HoverableRow>
            <DragContainer style={style} ref={setNodeRef}>
                <View position="relative" width="100%">
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="start"
                        wrap="nowrap"
                    >
                        <DragButton {...listeners} {...attributes}>
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
        </HoverableRow>
    );
};

const ContainerPaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
}> = ({ rowPane, index }) => {
    const { pane } = usePane(rowPane);
    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;
    const { isOver, setNodeRef } = useDroppable({
        id: pane.id,
        data: {
            targetId: pane.id,
            type: "container"
        }
    });

    const style = {
        border: isOver
            ? "1px solid var(--spectrum-global-color-fuchsia-400)"
            : "1px solid rgba(0,0,0,0)",
        background: isOver
            ? "var(--spectrum-global-color-static-gray-800)"
            : undefined,
        transition: "250ms all"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <PaneRow
                index={index}
                rowPane={rowPane}
                addPaneToContainer={addPaneToContainer}
            />
            <PaneList panes={panes} />
        </div>
    );
};

const PaneList: React.FC<{
    panes: PaneRef[];
}> = ({ panes }) => {
    const [items, setItems] = useState(panes.map((paneRef) => paneRef.id));
    return (
        <View
            borderStartColor={"gray-500"}
            borderStartWidth={"thick"}
            marginStart="size-50"
        >
            <SortableContext items={items}>
                {panes.map((pane, i) => {
                    if (pane.type === "container") {
                        return (
                            <ContainerPaneRow
                                key={pane.id}
                                rowPane={pane}
                                index={i}
                            />
                        );
                    } else {
                        return (
                            <PaneRow key={pane.id} rowPane={pane} index={i} />
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
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            targetId: id,
            type: "page"
        }
    });

    const style = {
        border: isOver
            ? "1px solid var(--spectrum-global-color-fuchsia-400)"
            : "1px solid rgba(0,0,0,0)",
        background: isOver
            ? "var(--spectrum-global-color-static-gray-800)"
            : undefined,
        transition: "250ms all"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <HoverableRow>
                <Flex direction="row" justifyContent="space-between">
                    <View>
                        <Button variant="primary" onPress={selectPage} isQuiet>
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

        //@ts-ignore
        const handleDragStart = ({ active }) => setActiveItem(active);
        const handleDragOver = ({ over, active}) => {
            const isSelf = active.id === over.id;
            if (isSelf) return;
            const currentParent = active?.data?.current?.parent
            const overParent = over?.data?.current?.parent
            const overNewParent = (
                over?.data?.current?.type === "page"
                ||
                over?.data?.current?.type === "container"
            )
            const haveParents = currentParent && overParent;
            const overCousinRow = (
                haveParents && currentParent.id !== overParent.id
            )
            const isSibling = (
                haveParents && currentParent.id === overParent.id
            )

            if (overNewParent) {
                const paneRefId = active?.id;
                const targetId = over?.id;
                reparentPane(paneRefId, targetId);
                return
            } else if (overCousinRow) {
                const paneRefId = active?.id;
                const targetId = overParent?.id;
                reparentPane(paneRefId, targetId);
                return
            } else if (isSibling) {
                const newIndex = over?.data?.current?.index
                if (active?.id && newIndex !== undefined) {
                    changePaneIndex(active?.id, newIndex)
                }
            }
        }
        // const handleDragOver = handleDragEnd;
            // const overContainer = findContainer(overId);
            // const activeContainer = findContainer(active.id);
    
            // if (!overContainer || !activeContainer) {
            //     return;
            // }
    
            // if (activeContainer !== overContainer) {
            //     setItems((items) => {
            //     const activeItems = items[activeContainer];
            //     const overItems = items[overContainer];
            //     const overIndex = overItems.indexOf(overId);
            //     const activeIndex = activeItems.indexOf(active.id);
    
            //     let newIndex: number;
    
            //     if (overId in items) {
            //         newIndex = overItems.length + 1;
            //     } else {
            //         const isBelowOverItem =
            //         over &&
            //         active.rect.current.translated &&
            //         active.rect.current.translated.top >
            //             over.rect.top + over.rect.height;
    
            //         const modifier = isBelowOverItem ? 1 : 0;
    
            //         newIndex =
            //         overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            //     }
    
            //     recentlyMovedToNewContainer.current = true;
    
            //     return {
            //         ...items,
            //         [activeContainer]: items[activeContainer].filter(
            //         (item) => item !== active.id
            //         ),
            //         [overContainer]: [
            //         ...items[overContainer].slice(0, newIndex),
            //         items[activeContainer][activeIndex],
            //         ...items[overContainer].slice(
            //             newIndex,
            //             items[overContainer].length
            //         ),
            //         ],
            //     };
            //     });
            // }
        // }

        // const collisionDetectionStrategy: CollisionDetection = useCallback(
        //     (args) => {
        //         if (activeItem) {
        //             return closestCenter({
        //                 ...args,
        //                 droppableContainers: args.droppableContainers
        //             });
        //         }

        //         // // Start by finding any intersecting droppable
        //         // const pointerIntersections = pointerWithin(args);
        //         // const intersections =
        //         //     pointerIntersections.length > 0
        //         //         ? // If there are droppables intersecting with the pointer, return those
        //         //           pointerIntersections
        //         //         : rectIntersection(args);
        //         // let overId = getFirstCollision(intersections, "id");

        //         // if (overId != null) {
        //         //     if (overId === TRASH_ID) {
        //         //         // If the intersecting droppable is the trash, return early
        //         //         // Remove this if you're not using trashable functionality in your app
        //         //         return intersections;
        //         //     }

        //         //     if (overId in items) {
        //         //         const containerItems = items[overId];

        //         //         // If a container is matched and it contains items (columns 'A', 'B', 'C')
        //         //         if (containerItems.length > 0) {
        //         //             // Return the closest droppable within that container
        //         //             overId = closestCenter({
        //         //                 ...args,
        //         //                 droppableContainers:
        //         //                     args.droppableContainers.filter(
        //         //                         (container) =>
        //         //                             container.id !== overId &&
        //         //                             containerItems.includes(container.id)
        //         //                     )
        //         //             })[0]?.id;
        //         //         }
        //         //     }

        //         //     lastOverId.current = overId;

        //         //     return [{ id: overId }];
        //         // }

        //         // // When a draggable item moves to a new container, the layout may shift
        //         // // and the `overId` may become `null`. We manually set the cached `lastOverId`
        //         // // to the id of the draggable item that was moved to the new container, otherwise
        //         // // the previous `overId` will be returned which can cause items to incorrectly shift positions
        //         // if (recentlyMovedToNewContainer.current) {
        //         //     lastOverId.current = activeId;
        //         // }

        //         // // If no droppable is matched, return the last match
        //         // return lastOverId.current ? [{ id: lastOverId.current }] : [];
        //     },
        //     [activeItem, JSON.stringify(pages)]
        // );

        const sensors = useSensors(
            useSensor(MouseSensor),
            useSensor(TouchSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter
            })
        );

        return (
            <Flex direction="column">
                <Heading margin="size-150" alignSelf="start">
                    Page Outline
                </Heading>
                <DndContext
                    modifiers={[restrictToVerticalAxis]}
                    onDragStart={handleDragStart}
                    // onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    // collisionDetection={collisionDetectionStrategy}
                    sensors={sensors}
                    measuring={{
                        droppable: {
                            strategy: MeasuringStrategy.Always
                        }
                    }}
                >
                    {pages.map((page) => (
                        <PageList key={page.id} page={page} />
                    ))}
                </DndContext>
            </Flex>
        );
    }
);
