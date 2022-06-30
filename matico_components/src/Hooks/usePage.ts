import { Page, Pane, PaneRef } from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import {
    updatePageDetails,
    removePage,
    addPane,
    addPaneRefToPage,
    addPaneRefToContainer
} from "../Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import { DefaultPosition } from "Components/MaticoEditor/Utils/PaneDetails";
import {usePaneContainer} from "./usePaneContainer";

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

    const removePageLocal = () => {
        dispatch(removePage({ pageId, removeOrphanPanes: false }));
    };

    const {addPaneToContainer, removePaneRefFromContainer} = usePaneContainer(page.id)


    return {
        page,
        updatePage,
        removePage: removePageLocal,
        panes,
        addPaneRefToPage: addPaneRefToContainer,
        addPaneToPage: addPaneToContainer,
        removePaneFromPage: removePaneRefFromContainer 
    };
};
