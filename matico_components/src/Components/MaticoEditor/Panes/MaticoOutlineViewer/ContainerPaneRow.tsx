import React from "react";
import { ContainerPane, PaneRef } from "@maticoapp/matico_types/spec";
import { useContainer } from "Hooks/useContainer";
import { useDroppable } from "@dnd-kit/core";
import { PaneRow } from "./PaneRow";
import { PaneList } from "./PaneList";
import { usePane } from "Hooks/usePane";
import { ContainerDropTarget } from "./ContainerDropTarget";
import { useMaticoSelector } from "Hooks/redux";

export const ContainerPaneRow: React.FC<{
    rowPane: PaneRef;
    depth: number;
}> = ({ rowPane, depth }) => {
    const { pane } = usePane(rowPane);
    const activeItem = useMaticoSelector(
        (state) => state.editor.activeDragItem
    );

    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;
    const { isOver, setNodeRef } = useDroppable({
        id: pane.id,
        data: {
            targetId: pane.id,
            paneId: pane.id,
            paneRefId: rowPane.id,
            depth,
            type: "container"
        }
    });

    // @ts-ignore
    const showDropZone =
        !!activeItem && activeItem?.data?.current?.type !== "page";

    return (
        <div>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
            >
                <PaneRow
                    rowPane={rowPane}
                    addPaneToContainer={addPaneToContainer}
                    depth={depth}
                />
            </ContainerDropTarget>
            <PaneList panes={panes} depth={depth + 1} />
        </div>
    );
};
