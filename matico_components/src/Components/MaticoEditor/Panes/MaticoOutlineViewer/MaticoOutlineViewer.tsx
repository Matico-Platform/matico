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
import { createPortal } from "react-dom";
import { outlineCollisionDetection } from "./CollisionDetection";
import { DraggablePane } from "./DraggablePane";
import { PageList } from "./PageList";
import { HoverableRow } from "./Styled";
import {
    SortableContext,
} from "@dnd-kit/sortable";
import { handleDrag } from "Utils/dragAndResize/handleDrag";
import { setActiveDragItem } from "Stores/editorSlice";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";

type MaticoOutlineViewerProps = RouteComponentProps & {};

export const MaticoOutlineViewer: React.FC = withRouter(
    ({ history, location }: MaticoOutlineViewerProps) => {
        // list pages
        const { pages, reparentPane, changePaneIndex, addPage, updatePageIndex } = useApp();
        const dispatch = useMaticoDispatch();
        const activeItem = useMaticoSelector((state) => state.editor.activeDragItem);
        //@ts-ignore
        const handleDragStart = ({ active }) => dispatch(setActiveDragItem(active));
        // const handleDragOver = (event: DragOverEvent) => {
        //     handleDrag(event, false, updatePageIndex, reparentPane, changePaneIndex)
        // }
        const handleDragEnd = (event: DragEndEvent) => {
            handleDrag(event, true, updatePageIndex, reparentPane, changePaneIndex);
            dispatch(setActiveDragItem(null));
        };

        const collisionDetectionStrategy: CollisionDetection = useCallback(
            outlineCollisionDetection,
            [activeItem?.id, JSON.stringify(pages)]
        );

        const sensors = useSensors(
            useSensor(MouseSensor),
            useSensor(TouchSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter
            })
        );
        return (
                <View width="100%" height="auto">
                    <Flex direction="column">
                        <HoverableRow hideBorder>
                            <Flex direction="row" alignItems="center">
                                <Heading marginY="size-0" marginX="size-150">
                                    Page Outline
                                </Heading>
                                {/* <HoverableItem> */}
                                    <ActionButton
                                        onPress={() => addPage({})}
                                        isQuiet
                                        >
                                        Add Page
                                    </ActionButton>
                                {/* </HoverableItem> */}
                            </Flex>
                        </HoverableRow>
                        <DndContext
                            modifiers={[restrictToVerticalAxis]}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            // onDragOver={handleDragOver}
                            collisionDetection={collisionDetectionStrategy}
                            sensors={sensors}
                        >
                            <SortableContext
                                items={pages.map((page) => page.id)}
                            >
                                {pages.map((page) => (
                                    <PageList key={page.id} page={page} route={{history, location}} />
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
                            </SortableContext>
                        </DndContext>
                    </Flex>
                </View>
        );
    }
);
