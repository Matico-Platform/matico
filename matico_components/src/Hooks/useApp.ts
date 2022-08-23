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
    removeDatasetTransform,
    updateMetadata,
    setPaneRefIndex,
    setPageIndex
} from "../Stores/MaticoSpecSlice";
import { v4 as uuidv4 } from "uuid";
import {Theme} from "@maticoapp/matico_types/spec";
import {Metadata} from "@maticoapp/matico_types/spec";

export const useApp = () => {

    const dispatch = useMaticoDispatch();
    const app = useMaticoSelector(
        (selector) => selector.spec.spec
    );

    const { metadata, pages, panes, theme, datasetTransforms } = app || {}

    const addPageLocal = (page: Partial<Page>) => {
        dispatch(
            addPage({
                page: {
                    name: pages.length === 0 ? "Home" : `Page ${pages.length}`,
                    id: uuidv4(),
                    layout: { type: "free", allowOverflow:false },
                    panes: [],
                    icon: pages.length === 0 ? "fas fa-home" : "fas fa-newspaper",
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

    const changePaneIndex = (
        paneRefId: string,
        newIndex: number
    ) => {
        dispatch(
            setPaneRefIndex({
                paneRefId,
                newIndex
            })
        )
    }

    const updatePageIndex = (
        pageId: string,
        newIndex: number
    ) => {  
        dispatch(
            setPageIndex({
                pageId,
                newIndex
            })
        )
    }

    return {
        app,
        pages,
        panes,
        theme,
        datasetTransforms,
        metadata,
        removePage: removePageLocal,
        addPage: addPageLocal,
        updatePageIndex,
        updatePage,
        setEditPage,
        reparentPane,
        changePaneIndex,
        addPane:_addPane,
        updateTheme: _updateTheme,
        addDatasetTransform: _addDatasetTransform,
        removeDatasetTransform: _removeDatasetTransform,
    };
};
