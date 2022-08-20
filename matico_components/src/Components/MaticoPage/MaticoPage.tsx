import React, { useRef } from "react";
import { Page, Layout } from "@maticoapp/matico_types/spec";
import { View, Flex } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import {usePage} from "Hooks/usePage";
import { useIsEditable } from "Hooks/useIsEditable";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { coordinateGetter } from "Components/MaticoEditor/EditorComponents/SortableDraggableList/multipleContainersKeyboardCoordinates";
import { ParentProvider } from "Hooks/useParentContext";
import styled from "styled-components";
interface MaticoPageInterface {
    pageId: string;
}

const PageParent = styled.div`
    width: 100%;
    height: 100%;
    overflow: none auto;
`

export const MaticoPage: React.FC<MaticoPageInterface> = ({ pageId }) => {
    let {page} = usePage(pageId)
    let layout: Layout = page?.layout;
    let LayoutEngine = selectLayout(layout);
    const parentRef = useRef<HTMLDivElement>(null);
    const isEdit = useIsEditable();
    const Wrapper = isEdit ? DndContext : React.Fragment;

    const handleDragStart = (event: any) => {
        // console.log("drag start", event);
    }
    const handleDragEnd = (event: any) => {
        // console.log("drag end", event);
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter
        })
    );



    return (
        <Wrapper
            // @ts-ignore
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // onDragOver={handleDragOver}
            // collisionDetection={collisionDetectionStrategy}
            sensors={sensors}
        >
            <PageParent ref={parentRef}>
                <ParentProvider parentRef={parentRef}>
                <Flex direction="column" width={"100%"} height={"100%"}>
                    <LayoutEngine paneRefs={page?.panes} />
                </Flex>
                </ParentProvider>
            </PageParent>
        </Wrapper>
    );
};
