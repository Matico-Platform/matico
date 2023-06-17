import React, { useRef } from "react";
import { Layout } from "@maticoapp/matico_types/spec";
import { Flex } from "@adobe/react-spectrum";
import { useDroppable } from "@dnd-kit/core";
import { ParentProvider } from "Hooks/useParentContext";
import styled from "styled-components";
import { ContainerDropTarget } from "Components/MaticoOutlineViewer/ContainerDropTarget";
import { useMaticoSelector } from "Hooks/redux";
import { pageAtomFamily, paneRefsForParent } from "Stores/SpecAtoms";
import { useRecoilValue } from "recoil";
import { LayoutEngine } from "Layouts/LayoutEngine";

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
  let paneRefs = useRecoilValue(paneRefsForParent(page.id))
  let layout: Layout = page?.layout;
  console.log("Page layout is ", layout)

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
            <LayoutEngine layout={layout} paneRefIds={paneRefs.map(pr => pr.id)} />
          </Flex>
        </ContainerDropTarget>
      </ParentProvider>
    </PageParent>
  );
};
