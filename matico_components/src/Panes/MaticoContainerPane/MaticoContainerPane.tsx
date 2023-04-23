import React from "react";
import { MaticoPaneInterface } from "../Pane";
import { useIsEditable } from "../../../Hooks/useIsEditable";
import { Content, View } from "@adobe/react-spectrum";
import { selectLayout } from "Utils/layoutEngine";
import { Layout, PaneRef } from "@maticoapp/matico_types/spec";
import { useDroppable } from "@dnd-kit/core";
import { usePane } from "Hooks/usePane";
import { ContainerDropTarget } from "Components/MaticoEditor/Panes/MaticoOutlineViewer/ContainerDropTarget";
import { useMaticoSelector } from "Hooks/redux";

export interface MaticoContainerPaneInterface extends MaticoPaneInterface {
    title?: string;
    panes: PaneRef[];
    layout: Layout;
    paneRef?: PaneRef;
    id: string
}

export const MaticoContainerPane: React.FC<MaticoContainerPaneInterface> = ({
    layout,
    panes,
    paneRef,
    id
}) => {
    const edit = useIsEditable();
    let Layout = selectLayout(layout);
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: {
            targetId: id,
            paneId: id,
            paneRefId: paneRef.id,
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
                <Layout paneRefs={panes} {...layout} paneRef={paneRef} />
            </Content>
        </ContainerDropTarget>
    );
};
