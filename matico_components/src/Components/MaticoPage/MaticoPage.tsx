import React, { useRef } from "react";
import { Layout } from "@maticoapp/matico_types/spec";
import { Flex } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import { usePage } from "Hooks/usePage";
import { useDroppable } from "@dnd-kit/core";
import { ParentProvider } from "Hooks/useParentContext";
import styled from "styled-components";
import { ContainerDropTarget } from "Components/MaticoEditor/Panes/MaticoOutlineViewer/ContainerDropTarget";
import { useMaticoSelector } from "Hooks/redux";
import { pageAtomFamily } from "Stores/SpecAtoms";
import { useRecoilValue } from "recoil";
interface MaticoPageInterface {
    pageId: string;
}

const PageParent = styled.div`
    width: 100%;
    height: 100%;
    overflow: none auto;
`;

export const MaticoPage: React.FC<MaticoPageInterface> = ({ pageId }) => {
    let page = useRecoilValue(pageAtomFamily(pageId));

    let layout: Layout = page?.layout;
    let LayoutEngine = selectLayout(layout);

    const parentRef = useRef<HTMLDivElement>(null);
    const { isOver, setNodeRef } = useDroppable({
        id: page?.id,
        data: {
            targetId: page?.id,
            type: "page",
            depth: 0
        }
    });


    const activeItem = useMaticoSelector(
        (state) => state.editor.activeDragItem
    );

    const showDropZone = // @ts-ignore
        !!activeItem && activeItem?.data?.current?.type !== "page";
    if (!page) {
        return null;
    }
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
