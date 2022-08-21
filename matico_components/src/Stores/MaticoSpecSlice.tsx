import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import {
    App,
    Pane,
    PaneRef,
    Page,
    Dataset,
    Layer,
    ContainerPane,
    PanePosition,
    DatasetTransform,
    DatasetTransformStep,
    Theme
} from "@maticoapp/matico_types/spec";
import _ from "lodash";
import { findPagesForPane, findPaneOrPage } from "Utils/specUtils/specUtils";

export type EditElement = {
    id?: string;
    parentId?: string;
    type: "page" | "pane" | "metadata" | "dataset" | "dataview" | "layer";
};

export interface SpecState {
    spec: App | undefined;
    normalizedSpec: App | undefined;
    editing: boolean;
    currentEditElement?: EditElement;
}

const initialState: SpecState = {
    spec: undefined,
    normalizedSpec: undefined,
    editing: false
};

export const findParent = (app: App, paneRefId: string) => {
    const potentialPage = app.pages.find((page: Page) =>
        page.panes.find((paneRef: PaneRef) => paneRef.id === paneRefId)
    );
    const potentialPane = app.panes.find(
        (pane: Pane) =>
            pane.type === "container" &&
            pane.panes.find((paneRef: PaneRef) => paneRef.id === paneRefId)
    );
    const container =
        potentialPane?.type === "container"
            ? (potentialPane as ContainerPane)
            : null;
    return potentialPage || container;
};

export const findRefParent = (app: App, paneRefId: string) => {
    const potentialPage = app.pages.find((page: Page) =>
        page.panes.find((paneRef: PaneRef) => paneRef.paneId === paneRefId)
    );
    const potentialPane = app.panes.find(
        (pane: Pane) =>
            pane.type === "container" &&
            pane.panes.find((paneRef: PaneRef) => paneRef.paneId === paneRefId)
    );
    const container =
        potentialPane?.type === "container"
            ? (potentialPane as ContainerPane)
            : null;
    return potentialPage || container;
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
        setPageIndex: (state, action: PayloadAction<{pageId: string, newIndex: number}>) => {
            const {pageId, newIndex} = action.payload;
            const page = state.spec.pages.find(page => page.id === pageId);
            if (page) {
                const oldIndex = state.spec.pages.indexOf(page);
                state.spec.pages.splice(oldIndex, 1);
                state.spec.pages.splice(newIndex, 0, page);
            }
        },
        removePage: (
            state,
            action: PayloadAction<{
                pageId: string;
                removeOrphanPanes: boolean;
            }>
        ) => {
            const { pageId, removeOrphanPanes } = action.payload;
            const page = state.spec.pages.find((p: Page) => p.id === pageId);

            if (removeOrphanPanes) {
                let orphanPanes = page.panes.filter(
                    (p: PaneRef) => findPagesForPane(state.spec, p).length === 0
                );
                orphanPanes.forEach((orphan: PaneRef) =>
                    _.remove(state.spec.panes, (p: Pane) => p.id === orphan.id)
                );
            }

            _.remove(state.spec.pages, (p: Page) => p.id === pageId);
        },
        removePane: (state, action: PayloadAction<{ id: string }>) => {
            _.remove(state.spec.pages, (p: Page) => p.id === action.payload.id);
        },
        updateNormalizedSpec:(
          state,
          action: PayloadAction<App>
        )=>{
          state.normalizedSpec = action.payload 
        },
        setPaneRefIndex: (
            state,
            action: PayloadAction<{

                paneRefId: string;
                newIndex: number;
            }>
        ) => {
            const { paneRefId, newIndex } = action.payload;
            const parent = findRefParent(state.spec, paneRefId);
            if (parent) {
                //@ts-ignore if parent is found it is known to be of type ContainerPane or Page
                const panes = parent.panes;
                const pane = _.remove(
                    panes,
                    (p: PaneRef) => p.paneId === paneRefId
                );
                panes.splice(newIndex, 0, pane[0]);
            }
        },
        setPaneOrder: (
            state,
            action: PayloadAction<{
                parentId: string;
                paneRef: PaneRef;
                newIndex: number;
            }>
        ) => {
            const { paneRef, newIndex } = action.payload;
            const parent = findParent(state.spec, paneRef.id);

            if (parent) {
                //@ts-ignore if parent is found it is known to be of type ContainerPane or Page
                const panes = parent.panes;
                const pane = _.remove(
                    panes,
                    (p: PaneRef) => p.id === paneRef.id
                );
                panes.splice(newIndex, 0, pane[0]);
            }
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
        removePaneRefFromContainer: (
            state,
            action: PayloadAction<{ containerId: string; paneRefId: string }>
        ) => {
            let { containerId, paneRefId } = action.payload;
            let container: ContainerPane | Page =
                state.spec.pages.find((p) => p.id == containerId) ||
                (state.spec.panes.find(
                    (p) => p.id == containerId && p.type === "container"
                ) as ContainerPane);
            if (!container) return;
            _.remove(
                container.panes,
                (p: PaneRef) => p.id === action.payload.paneRefId
            );
        },
        removePaneRef: (
            state,
            action: PayloadAction<{ paneRefId: string }>
        ) => {
            const { paneRefId } = action.payload;
            const parent = findRefParent(state.spec, paneRefId);
            if (parent) {
                _.remove(parent.panes, (p: PaneRef) => p.paneId === paneRefId);
            }
        },
        reparentPaneRef: (
            state,
            action: PayloadAction<{ paneRefId: string; targetId: string }>
        ) => {
            const { paneRefId, targetId } = action.payload;
            if (paneRefId === targetId) {
                // dropped a container on itself :o
                return;
            }
            const parent = findRefParent(state.spec, paneRefId);
            const target = findPaneOrPage(state.spec, targetId);
            if (parent && target && parent.id !== target.id) {
                const pane = parent.panes.find(
                    (p: PaneRef) => p.paneId === paneRefId
                );
                _.remove(parent.panes, (p: PaneRef) => p.paneId === paneRefId);
                target.panes.push(pane);
            }
        },
        addPane: (state, action: PayloadAction<{ pane: Pane }>) => {
            state.spec.panes.push(action.payload.pane);
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
            let container: ContainerPane | Page =
                state.spec.pages.find((p) => p.id == containerId) ||
                (state.spec.panes.find(
                    (p) => p.id == containerId && p.type === "container"
                ) as ContainerPane);
            if (!container) return;

            if (index) {
                container.panes.splice(index, 0, action.payload.paneRef);
            } else {
                container.panes.push(paneRef);
            }
        },
        updatePaneDetails: (
            state,
            action: PayloadAction<{ id: string; update: Partial<Pane> }>
        ) => {
            const { id, update } = action.payload;
            let pane: Pane = state.spec.panes.find((p: Pane) => p.id === id);

            Object.assign(pane, update);
        },
        updatePageDetails: (
            state,
            action: PayloadAction<{ pageId: string; update: Partial<Page> }>
        ) => {
            let { pageId, update } = action.payload;
            let page = state.spec.pages.find((p: Page) => p.id === pageId);
            Object.assign(page, update);
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
            const pane = parent.panes.find((p: PaneRef) => p.id === paneRefId);
            const position = pane.position;
            Object.assign(position, update);
        },
        setCurrentEditElement: (state, action: PayloadAction<EditElement>) => {
            state.currentEditElement = action.payload;
        },
        setLayerOrder: (
            state,
            action: PayloadAction<{
                newIndex: number;
                layerId: string;
                mapId: string;
            }>
        ) => {
            const { mapId, layerId, newIndex } = action.payload;
            const map = state.spec.panes.find(
                (p: Pane) => p.id === mapId && p.type === "map"
            );

            //@ts-ignore
            let layers = map.layers;
            let layer = _.remove(
                layers,
                (layers: Layer) => layers.id === layerId
            );
            layers.slice(newIndex, 0, layer);
        },
        updateTheme: (
            state,
            action: PayloadAction<{ update: Partial<Theme> }>
        ) => {
            let theme = state.spec.theme;
            let update = action.payload.update;
            Object.assign(theme, update);
        },
        updateMetadata: (
            state,
            action: PayloadAction<{ update: Partial<Metadata> }>
        ) => {
            let theme = state.spec.metadata;
            let update = action.payload.update;
            Object.assign(metadata, update);
        },
        updateLayer: (
            state,
            action: PayloadAction<{
                mapId: string;
                layerId: string;
                update: Partial<Layer>;
            }>
        ) => {
            const { mapId, layerId, update } = action.payload;
            const map = state.spec.panes.find(
                (p: Pane) =>
                    p.id === mapId && ["map", "staticMap"].includes(p.type)
            );
            //@ts-ignore
            let layer = map.layers.find((layer: Layer) => layer.id === layerId);
            Object.assign(layer, update);
        },
        removeLayer: (
            state,
            action: PayloadAction<{
                mapId: string;
                layerId: string;
            }>
        ) => {
            const { mapId, layerId } = action.payload;
            const map = state.spec.panes.find(
                (p: Pane) => p.id === mapId && p.type === "map"
            );

            //@ts-ignore
            let layers = map.layers;
            _.remove(layers, (layers: Layer) => layers.id === layerId);
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
        },

        addDatasetTransform: (
            state,
            action: PayloadAction<DatasetTransform>
        ) => {
            state.spec.datasetTransforms.push(action.payload);
        },

        removeDatasetTransform: (
            state,
            action: PayloadAction<{ id: string }>
        ) => {
            state.spec.datasetTransforms = state.spec.datasetTransforms.filter(
                (dt) => dt.id !== action.payload.id
            );
        },

        updateDatasetTransform: (
            state,
            action: PayloadAction<Partial<DatasetTransform>>
        ) => {
            const update = action.payload;
            let transform = state.spec.datasetTransforms.find(
                (dt) => dt.id === update.id
            );
            Object.assign(transform, update);
        },
        addDatasetTransformStep: (
            state,
            action: PayloadAction<{
                transformId: string;
                step: DatasetTransformStep;
            }>
        ) => {
            const { step, transformId } = action.payload;
            let transform = state.spec.datasetTransforms.find(
                (dt) => dt.id === transformId
            );
            transform.steps.push(step);
        },
        removeDataset:(
            state,
            action:PayloadAction<{name:string}>
        )=>{
          let {name}= action.payload
          let newDatasets = state.spec.datasets.filter(d=>d.name!== name)
          state.spec.datasets = newDatasets
        },
        updateDatasetTransformStep: (
            state,
            action: PayloadAction<{
                transformId: string;
                update: Partial<addDatasetTransformStep>;
            }>
        ) => {
            const { update, transformId } = action.payload;
            let transform = state.spec.datasetTransforms.find(
                (dt) => dt.id === transformId
            );
            //@ts-ignore
            transform.steps = transform.steps.map((step) =>
                step.id === update.id ? { ...step, ...update } : step
            );
        },
        removeDatasetTransformStep: (
            state,
            action: PayloadAction<{ transformId: string; stepId: string }>
        ) => {
            const { stepId, transformId } = action.payload;
            let transform = state.spec.datasetTransforms.find(
                (dt: DatasetTransform) => dt.id === transformId
            );
            //@ts-ignore
            transform.steps = transform.steps.filter(
                (step: DatasetTransformStep) => step.id !== stepId
            );
        }
    }
});

export const {
    setEditing,
    setSpec,
    addPage,
    setPageIndex,
    removePage,
    removePane,
    addPaneToPage,
    updateDatasetSpec,
    removeDataset,
    updatePaneDetails,
    updatePanePosition,
    addDataset,
    updateLayer,
    setLayerOrder,
    removeLayer,
    setPaneOrder,
    setPaneRefIndex,
    setCurrentEditElement,
    addPane,
    addPaneRefToContainer,
    removePaneRef,
    reparentPaneRef,
    removePaneRefFromContainer,
    updatePageDetails,
    updateTheme,
    updateMetadata,
    addDatasetTransform,
    removeDatasetTransform,
    updateDatasetTransform,
    updateDatasetTransformStep,
    removeDatasetTransformStep,
    addDatasetTransformStep,
    updateNormalizedSpec
} = stateSlice.actions;

export const selectSpec = (state: SpecState) => state.spec;

export const specReducer = stateSlice.reducer;
