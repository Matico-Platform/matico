import { Page, Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import {
    updatePageDetails,
    removePage,
    addPane,
    addPaneRefToPage,
    setCurrentEditElement
} from "../Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import { DefaultPosition } from "Components/MaticoEditor/Utils/PaneDetails";

interface ParentActions {
    addPaneToParent: (p: Pane, position: PanePosition) => void;
    addPaneRefToParent: (id: string) => void;
    removePaneRefFromParent: (id: string) => void;
    setPaneIndex: (id: string, index: number) => void;
    changeLayoutType: (layout: Layout) => void;
}

interface PaneRefActions {
    // delete
    // ...
    deletePaneRef: () => void;
    reparentPaneRef: (targetPaneId: string) => void;
    copyPaneRef: (targetPaneId: string) => void;
    updatePosition: () => void;
}

export const usePage = (pageId: string) => {
    const page = useMaticoSelector((selector) =>
        selector.spec.spec.pages.find((p: Page) => p.id == pageId)
    );

    const allPanes = useMaticoSelector((selector) => selector.spec.spec.panes);

    const panes = page.panes.map((paneRef: PaneRef) =>
        allPanes.find((p: Pane) => p.id === paneRef.paneId)
    );

    const dispatch = useMaticoDispatch();

    const updatePage = (update: Partial<Page>) => {
        dispatch(updatePageDetails({ pageId, update }));
    };

    const selectPage = () => {
        dispatch(
            setCurrentEditElement({
                type: "page",
                id: pageId
            })
        );
    };

    const removePageLocal = () => {
        dispatch(removePage({ pageId, removeOrphanPanes: false }));
    };

    const addPaneToPage = (pane: Pane) => {
        dispatch(addPane({ pane }));
        const paneRef = {
            id: uuidv4(),
            paneId: pane.id,
            type: pane.type,
            position: DefaultPosition
        };
        //@ts-ignore not sure why we are getting this error pane.type and paneRef.type should have the same set of entries
        _addPaneRefToPage(paneRef);
    };
    const _addPaneRefToPage = (paneRef: PaneRef, index?: number) => {
        dispatch(
            addPaneRefToPage({
                pageId: pageId,
                paneRef: paneRef,
                index: index
            })
        );
    };

    return {
        page,
        updatePage,
        removePage: removePageLocal,
        panes,
        addPaneRefToPage: _addPaneRefToPage,
        addPaneToPage,
        selectPage
    };
};
