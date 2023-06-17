import React from "react";
import { Content } from "@adobe/react-spectrum";
import { Layout, PaneRef } from "@maticoapp/matico_types/spec";
import { useDroppable } from "@dnd-kit/core";
import { ContainerDropTarget } from "Components/MaticoOutlineViewer/ContainerDropTarget";
import { useMaticoSelector } from "Hooks/redux";
import { LayoutEngine } from "Layouts/LayoutEngine";

export interface MaticoContainerPaneInterface {
  layout: Layout,
  paneRefs: Array<PaneRef>,
  edit: boolean,
  id: string
}

export const MaticoContainerPane: React.FC<MaticoContainerPaneInterface> = ({
  id,
  layout,
  paneRefs,
  edit,
}) => {


  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      targetId: id,
      paneId: id,
      paneRefId: id,
      type: "container"
    }
  });

  const activeItem = useMaticoSelector(
    (state) => state.editor.activeDragItem
  );
  const showDropZone = // @ts-ignore
    !!activeItem && activeItem?.data?.current?.type !== "page";

  return (
    <ContainerDropTarget
      style={{
        position: "relative",
        // overflow: "hidden auto",
        width: "100%",
        height: "100%",
        backgroundColor: edit ? undefined : "transparent"
      }}
      ref={setNodeRef}
      isOver={isOver}
      active={showDropZone}
    >
      <Content width="100%" height="100%">
        <LayoutEngine paneRefIds={paneRefs.map(pr => pr.id)} layout={layout} />
      </Content>
    </ContainerDropTarget>
  );
};
