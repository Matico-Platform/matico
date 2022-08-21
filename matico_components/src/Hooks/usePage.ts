import { Page, Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import {
    updatePageDetails,
    removePage,
    addPane,
    setCurrentEditElement,
    addPaneRefToContainer
} from "../Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import { DefaultPosition } from "Components/MaticoEditor/Utils/PaneDetails";
import {usePaneContainer} from "./usePaneContainer";

// interface ParentActions {
//     addPaneToParent: (p: Pane, position: PanePosition) => void;
//     addPaneRefToParent: (id: string) => void;
//     removePaneRefFromParent: (id: string) => void;
//     setPaneIndex: (id: string, index: number) => void;
//     changeLayoutType: (layout: Layout) => void;
// }

// interface PaneRefActions {
//     // delete
//     // ...
//     deletePaneRef: () => void;
//     reparentPaneRef: (targetPaneId: string) => void;
//     copyPaneRef: (targetPaneId: string) => void;
//     updatePosition: () => void;
// }

export const usePage = (pageId: string) => {
    const dispatch = useMaticoDispatch();
    const page = useMaticoSelector((selector) =>
        selector.spec.spec.pages.find((p: Page) => p.id == pageId)
    );
    const {addPaneToContainer, removePaneRefFromContainer} = usePaneContainer(page?.id)
    const allPanes = useMaticoSelector((selector) => selector.spec.spec.panes);


    // possible race condition after deletion
    if (!page) return {};

    const panes = page.panes.map((paneRef: PaneRef) =>
        allPanes.find((p: Pane) => p.id === paneRef.paneId)
    );


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

    return {
        page,
        updatePage,
        removePage: removePageLocal,
        panes,
        addPaneRefToPage: addPaneRefToContainer,
        addPaneToPage: addPaneToContainer,
        removePaneFromPage: removePaneRefFromContainer,
        selectPage
    };
};
