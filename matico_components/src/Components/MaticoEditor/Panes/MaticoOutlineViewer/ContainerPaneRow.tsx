import React from "react";
import {
    ContainerPane,
    PaneRef
} from "@maticoapp/matico_types/spec";
import { useContainer } from "Hooks/useContainer";
import {
    useDroppable,
} from "@dnd-kit/core";
import { ContainerDropTarget } from "./Styled";
import { PaneRow } from "./PaneRow";
import { PaneList } from "./PaneList";
import { usePane } from "Hooks/usePane";
import { useDraggingContext } from "./DraggingContext";

export const ContainerPaneRow: React.FC<{
    rowPane: PaneRef;
    index: number;
    depth: number;
}> = ({ rowPane, index, depth }) => {
    const { pane } = usePane(rowPane);
    const activeItem = useDraggingContext();
    const { addPaneToContainer } = useContainer(rowPane);
    const { panes } = pane as ContainerPane;
    const { isOver, setNodeRef } = useDroppable({
        id: pane.id,
        data: {
            targetId: pane.id,
            paneId: pane.id,
            paneRefId: rowPane.id,
            depth,
            index,
            type: "container"
        }
    });

    // @ts-ignore
    const showDropZone = !!activeItem && activeItem?.data?.current?.type !== "page";

    return (
        <div>
            <ContainerDropTarget
                ref={setNodeRef}
                active={showDropZone}
                isOver={isOver}
                depth={depth}
            >
                <PaneRow
                    index={index}
                    rowPane={rowPane}
                    addPaneToContainer={addPaneToContainer}
                    depth={depth}
                />
            </ContainerDropTarget>
            <PaneList panes={panes} depth={depth + 1} />
        </div>
    );
};
