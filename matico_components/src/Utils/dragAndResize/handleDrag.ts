import { DragOverEvent } from "@dnd-kit/core";
import { DragEndEvent } from "@react-types/shared";
import { throttle } from "lodash";

export const handleDrag = throttle(
    (
        event: DragOverEvent | DragEndEvent, 
        isDragEnd: boolean,
        updatePageIndex: (pageId: string, pageIndex: number) => void,
        reparentPane: (paneRefId: string, newParentId: string) => void,
        changePaneIndex: (paneRefId: string, newIndex: number) => void,
    ) => {
        // @ts-ignore
        const { over, active } = event;
        const isSelf = active.id === over?.id;
        if (isSelf || !over) return;
        if (active?.data?.current?.type === "page"){
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
            if (isDragEnd || over?.data?.current?.type === 'page') {
                reparentPane(paneRefId, targetId);
            }
            return;
        } else if (overCousinRow) {
            const paneRefId = active?.data?.current?.paneId;
            const targetId = overParent?.id;
            reparentPane(paneRefId, targetId);
            return;
        } else if (isSibling && isDragEnd) {
            const newIndex = over?.data?.current?.sortable?.index;
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