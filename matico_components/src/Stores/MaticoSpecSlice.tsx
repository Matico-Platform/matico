import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import {
    App,
    Pane,
    PaneRef,
    Page,
    Dataset
} from "@maticoapp/matico_types/spec";
import _ from "lodash";
import { findPagesForPane } from "Utils/specUtils/specUtils";
import { PanePosition } from "@maticoapp/matico_spec";

export type EditElement = {
    id?: string;
    type: "page" | "pane" | "metadata" | "dataset" | "dataview" | "layer";
};

export interface SpecState {
    spec: App | undefined;
    editing: boolean;
    currentEditElement?: EditElement;
}

const initialState: SpecState = {
    spec: undefined,
    editing: false
};

export const findParent = (app: App, paneRefId: string) => {
    const parent =
        app.pages.find((page: Page) =>
            page.panes.find((paneRef: PaneRef) => paneRef.id === paneRefId)
        ) ||
        app.panes.find(
            (pane: Pane) =>
                pane.type === "container" &&
                pane.panes.find((paneRef: PaneRef) => paneRef.id === paneRefId)
        );
    return parent;
};

export const stateSlice = createSlice({
    name: "variables",
    initialState,
    reducers: {
        setEditing: (state, action: PayloadAction<boolean>) => {
            state.editing = action.payload;
        },
        setSpec: (state, action: PayloadAction<App>) => {
            state.spec = action.payload;
        },
        addDataset: (state, action: PayloadAction<{ dataset: Dataset }>) => {
            state.spec.datasets.push(action.payload.dataset);
        },
        addPage: (state, action: PayloadAction<{ page: Page }>) => {
            state.spec.pages.push(action.payload.page);
        },
        removePage: (
            state,
            action: PayloadAction<{ id: string; removeOrphanPanes: boolean }>
        ) => {
            const { id, removeOrphanPanes } = action.payload;
            const page = state.spec.pages.find((p: Page) => p.id === id);

            if (removeOrphanPanes) {
                let orphanPanes = page.panes.filter(
                    (p: PaneRef) => findPagesForPane(state.spec, p).length === 0
                );
                orphanPanes.forEach((orphan: PaneRef) =>
                    _.remove(state.spec.panes, (p: Pane) => p.id === orphan.id)
                );
            }

            _.remove(state.spec.pages, (p: Page) => p.id === action.payload.id);
        },
        removePane: (state, action: PayloadAction<{ id: string }>) => {
            _.remove(state.spec.pages, (p: Page) => p.id === action.payload.id);
        },
        setPaneOrderOnPage: (
            state,
            action: PayloadAction<{
                pageId: string;
                paneRef: PaneRef;
                newIndex: number;
            }>
        ) => {
            const page = state.spec.pages.find(
                (p: Page) => p.id === action.payload.pageId
            );
            //TODO
        },

        addPaneToPage: (
            state,
            action: PayloadAction<{
                pageId: string;
                paneRef: PaneRef;
                index?: number;
            }>
        ) => {
            const page = state.spec.pages.find(
                (p: Page) => p.id === action.payload.pageId
            );
            if (action.payload.index) {
                page.panes.splice(
                    action.payload.index,
                    0,
                    action.payload.paneRef
                );
            } else {
                page.panes.push(action.payload.paneRef);
            }
        },
        removePaneFromPage: (
            state,
            action: PayloadAction<{ pageId: string; paneRefId: string }>
        ) => {
            const page = state.spec.pages.find(
                (p: Page) => p.id === action.payload.pageId
            );
            _.remove(
                page.panes,
                (p: PaneRef) => p.id === action.payload.paneRefId
            );
        },
        addPaneRefToContainer: (
            state,
            action: PayloadAction<{
                containerId: string;
                paneRef: PaneRef;
                index?: number;
            }>
        ) => {
            const { containerId, paneRef, index } = action.payload;
            const container = state.spec.panes.find(
                (p: Pane) =>
                    p.id == action.payload.containerId && p.type === "container"
            );
            if (index) {
                //@ts-ignore
                container.panes.splice(
                    action.payload.index,
                    0,
                    action.payload.paneRef
                );
            } else {
                //@ts-ignore
                container.panes.push(action.payload.paneRef);
            }
        },
        removePaneFromContainer: (
            state,
            action: PayloadAction<{ containerId: string; paneRefId: string }>
        ) => {
            const container = state.spec.panes.find(
                (p: Pane) => p.id == action.payload.containerId
            );
            if (container && container.type === "container") {
                _.remove(
                    container.panes,
                    (p: PaneRef) => p.id === action.payload.paneRefId
                );
            }
        },
        addPane:(
          state,
          action: PayloadAction<{pane:Pane}>
        )=>{
          state.spec.panes.push(action.payload.pane)
        },
        updatePaneDetails: (
            state,
            action: PayloadAction<{ id: string; update: Partial<Pane> }>
        ) => {
            let pane: Pane = state.spec.panes.find(
                (p: Pane) => p.id === action.payload.id)

            //@ts-ignore
            pane = { ...pane, ...action.payload.update };
        },
        updatePageDetails: (
            state,
            action: PayloadAction<{ id: string; update: Partial<Page> }>
        ) => {
            let { id, update } = action.payload;
            let page = state.spec.pages.find((p: Page) => p.id === id);
            page = { ...page, ...update };
        },
        updatePanePosition: (
            state,
            action: PayloadAction<{
                paneRefId: string;
                update: Partial<PanePosition>;
            }>
        ) => {
            const { paneRefId, update } = action.payload;
            const parent = findParent(state.spec, paneRefId);
            //@ts-ignore
            parent.panes = parent.panes.map((p: PaneRef) =>
                p.id === paneRefId
                    ? { ...p, position: { ...p.position, ...update } }
                    : p
            );
        },
        setCurrentEditElement: (state, action: PayloadAction<EditElement>) => {
            state.currentEditElement = action.payload;
        },
        updateDatasetSpec: (
            state,
            action: PayloadAction<{
                name: string;
                datasetSpec: Partial<Dataset>;
            }>
        ) => {
            const { name, datasetSpec } = action.payload;
            let datasetToUpdate = state.spec.datasets.find(
                (d: Dataset) => d.name === name
            );
            //@ts-ignore
            datasetToUpdate = { ...datasetToUpdate, ...datasetSpec };
        }
    }
});

export const {
    setEditing,
    setSpec,
    addPage,
    removePage,
    removePane,
    addPaneToPage,
    removePaneFromPage,
    updateDatasetSpec,
    updatePaneDetails,
    updatePanePosition,
    addDataset,
    setCurrentEditElement,
    addPane,
    addPaneRefToContainer,
    removePaneFromContainer,
    updatePageDetails
} = stateSlice.actions;

export const selectSpec = (state: SpecState) => state.spec;

export const specReducer = stateSlice.reducer;
