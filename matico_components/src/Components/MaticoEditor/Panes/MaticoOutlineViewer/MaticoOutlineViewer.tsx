import React, { useCallback, useEffect, useState } from "react";
import {
    ActionButton,
    Button,
    Flex,
    Heading,
    View
} from "@adobe/react-spectrum";
import { useApp } from "Hooks/useApp";
import { Page, PaneRef } from "@maticoapp/matico_types/spec";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
    closestCenter,
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { coordinateGetter } from "../../EditorComponents/SortableDraggableList/multipleContainersKeyboardCoordinates";
import throttle from "lodash/throttle";
import { createPortal } from "react-dom";
import { outlineCollisionDetection } from "./CollisionDetection";
import { DraggingProvider } from "./DraggingContext";
import { DraggablePane } from "./DraggablePane";
import { PageList } from "./PageList";
import { HoverableItem, HoverableRow } from "./Styled";
import { SortableContext } from "@dnd-kit/sortable";
import { PaneList } from "./PaneList";

type MaticoOutlineViewerProps = RouteComponentProps & {
    showPanes?: boolean;
    showTitle?: boolean;
    panes?: PaneRef[];
};

export const MaticoOutlineViewer: React.FC = withRouter(
    ({
        history,
        location,
        showPanes = true,
        showTitle = true,
        panes
    }: MaticoOutlineViewerProps) => {
        // list pages
        const {
            pages,
            reparentPane,
            changePaneIndex,
            addPage,
            updatePageIndex
        } = useApp();
        const [activeItem, setActiveItem] =
            useState<Page | PaneRef | null>(null);

        const handleDrag = throttle(
            (event: DragOverEvent | DragEndEvent, isDragEnd: boolean) => {
                const { over, active } = event;
                const isSelf = active.id === over?.id;
                if (isSelf || !over) return;
                if (active?.data?.current?.type === "page") {
                    const overIndex = over?.data?.current?.sortable?.index;
                    updatePageIndex(active.id as string, overIndex);
                    return;
                }
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
            },
            125
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
            outlineCollisionDetection,
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
                <View width="100%" height="auto">
                    <Flex direction="column">
                        {showTitle && (
                            <HoverableRow hideBorder>
                                <Flex direction="row" alignItems="center">
                                    <Heading
                                        marginY="size-0"
                                        marginX="size-150"
                                    >
                                        Page Outline
                                    </Heading>
                                    <HoverableItem>
                                        <ActionButton
                                            onPress={() => addPage({})}
                                            isQuiet
                                        >
                                            Add Page
                                        </ActionButton>
                                    </HoverableItem>
                                </Flex>
                            </HoverableRow>
                        )}
                        <DndContext
                            modifiers={[restrictToVerticalAxis]}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            // onDragOver={handleDragOver}
                            collisionDetection={collisionDetectionStrategy}
                            sensors={sensors}
                        >
                            {!!panes ? (
                                <PaneList panes={panes} />
                            ) : (
                                <SortableContext
                                    items={pages.map((page) => page.id)}
                                >
                                    {pages.map((page) => (
                                        <PageList
                                            key={page.id}
                                            page={page}
                                            route={{ history, location }}
                                            showPanes={showPanes}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </DndContext>
                    </Flex>
                </View>
                {!!activeItem &&
                    createPortal(
                        <DragOverlay adjustScale={false}>
                            <DraggablePane activeItem={activeItem} />
                        </DragOverlay>,
                        document.body
                    )}
            </DraggingProvider>
        );
    }
);
