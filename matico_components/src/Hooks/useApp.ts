import {
  DatasetTransform,
    Page, Pane,
} from "@maticoapp/matico_types/spec";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
import {
    updatePageDetails,
    removePage,
    addPage,
    setCurrentEditElement,
    reparentPaneRef,
    updateTheme,
    addPane,
    addDatasetTransform,
    removeDatasetTransform
} from "../Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import {Theme} from "@maticoapp/matico_types/spec";
import {Metadata} from "@maticoapp/matico_types/spec";

export const useApp = () => {
    const { metadata, pages, panes, theme, datasetTransforms } = useMaticoSelector(
        (selector) => selector.spec.spec
    );

    const dispatch = useMaticoDispatch();

    const addPageLocal = (page: Partial<Page>) => {
        dispatch(
            addPage({
                page: {
                    name: pages.length === 0 ? "Home" : `Page ${pages.length}`,
                    id: uuidv4(),
                    layout: { type: "free", allowOverflow:false },
                    panes: [],
                    icon: pages.length === 0 ? "fa faHome" : "fa faPage",
                    path: pages.length === 0 ? "/" : `/page_${pages.length}`,
                    ...page
                }
            })
        );
    };

    const setEditPage = (id: string) => {
        dispatch(
            setCurrentEditElement({
                type: "page",
                id
            })
        );
    };

    const _updateMetadata = (update:Partial<Metadata>)=>{
      dispatch(updateMetadata({update}))
    }
    const updatePage = (pageId: string, update: Partial<Page>) => {
        dispatch(updatePageDetails({ pageId, update }));
    };

    const removePageLocal = (pageId: string) => {
        dispatch(removePage({ pageId, removeOrphanPanes: false }));
    };

    const _addDatasetTransform = ( transform: DatasetTransform) =>{
        dispatch(addDatasetTransform(transform))
    }
    const _removeDatasetTransform= ( transform: DatasetTransform) =>{
        dispatch(removeDatasetTransform(transform))
    }

    const _updateTheme= (update: Partial<Theme>)=>{
        dispatch(updateTheme({update}))
    }

    const _addPane =(pane: Pane)=>{
        dispatch(addPane({pane}))
    }

    const reparentPane = (
        paneRefId: string,
        targetId: string
    ) => {
        dispatch(
            reparentPaneRef({
                paneRefId,
                targetId
            })
        );
    };

    return {
        pages,
        panes,
        theme,
        datasetTransforms,
        metadata,
        removePage: removePageLocal,
        addPage: addPageLocal,
        updatePage,
        setEditPage,
        reparentPane,
        addPane:_addPane,
        updateTheme: _updateTheme,
        addDatasetTransform: _addDatasetTransform,
        removeDatasetTransform: _removeDatasetTransform,
    };
};
