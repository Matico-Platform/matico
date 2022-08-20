import React, { useRef } from "react";
import { Page, Layout } from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import { usePage } from "Hooks/usePage";
import { useIsEditable } from "Hooks/useIsEditable";
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { ParentProvider } from "Hooks/useParentContext";
import styled from "styled-components";
import {
    restrictToParentElement,
    restrictToWindowEdges
} from "@dnd-kit/modifiers";
import { DraggingProvider, useDraggingContext } from "Components/MaticoEditor/Panes/MaticoOutlineViewer/DraggingContext";
import { handleDrag } from "Utils/dragAndResize/handleDrag";
import { useApp } from "Hooks/useApp";
import {
    layoutCollisionDetection,
    outlineCollisionDetection
} from "Components/MaticoEditor/Panes/MaticoOutlineViewer/CollisionDetection";
import { ContainerDropTarget } from "Components/MaticoEditor/Panes/MaticoOutlineViewer/ContainerDropTarget";
interface MaticoPageInterface {
    pageId: string;
}

const PageParent = styled.div`
    width: 100%;
    height: 100%;
    overflow: none auto;
`;

export const MaticoPage: React.FC<MaticoPageInterface> = ({ pageId }) => {
    let { page } = usePage(pageId);
    let layout: Layout = page?.layout;
    let LayoutEngine = selectLayout(layout);

    const parentRef = useRef<HTMLDivElement>(null);

    const { isOver, setNodeRef } = useDroppable({
        id: page.id,
        data: {
            targetId: page.id,
            type: "page",
            depth: 0
        }
    });
    const activeItem = useDraggingContext();
    const showDropZone = // @ts-ignore
        !!activeItem && activeItem?.data?.current?.type !== "page";

    return (
        <PageParent ref={parentRef}>
            <ParentProvider parentRef={parentRef}>
                <ContainerDropTarget
                    ref={setNodeRef}
                    active={showDropZone}
                    isOver={isOver}
                >
                    <Flex direction="column" width={"100%"} height={"100%"}>
                        <LayoutEngine paneRefs={page?.panes} />
                    </Flex>
                </ContainerDropTarget>
            </ParentProvider>
        </PageParent>
    );
};
