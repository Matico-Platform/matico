import { ChartCompositionState, ExternalDataStore, ChartComposition, ScaleState, Data, UpdateTrigger, ChartLayout, Chart, ChartState, ScaleHash, Layer, RequiredScales, LayerState, ScaleSpec } from '../Types/Composition'
import create from "zustand";
import { devtools } from 'zustand/middleware';
import { isFunction, uid, get } from 'radash'

export let externalDataStore: ExternalDataStore = {}

const initialState: ChartCompositionState = {
    root: {
        width: 0,
        height: 0
    },
    datasets: {},
    scales: {},
    charts: [],
    link: {},
    active: {},
    initialized: false
};

export type Actions = {
    upsertSpec: (spec: ChartComposition) => void;
    setDimensions: (width: number, height: number) => void;
    setScale?: ({
        scaleFunction,
        extent,
        dataId,
        spec,
    }: ScaleState) => void;
};

export type Accessors = {
    getData: (id: string) => (state: ChartCompositionState) => {
        data: Data
        id: string
        timestamp: UpdateTrigger
    };
}

type Store = ChartCompositionState & Actions & Accessors;

const StoreFunctions = (set) => ({
    ...initialState,
    upsertSpec: (spec: ChartComposition) => set((state: ChartCompositionState) => {
        const { charts: chartLayouts, data } = spec;
        const { datasets, initialized, scales, charts: chartStates, root: {width, height} } = state;

        if (data && data !== externalDataStore.root) {
            externalDataStore['root'] = data;
            datasets['root'] = new Date().getTime()
        }

        const registrar = new SpecRegistrar({
            datasets,
            initialized,
            chartStates,
            chartLayouts,
            scales
        })

        // the related dataIds for each chart
        // composition wide dataID is always 'root' 
        registrar.registerDatasets()
        registrar.registerScales()
        
        return {
            datasets,
            charts: chartStates,
            initialized: true
        };
    }),
    setDimensions: (width: number, height: number) => set((state: ChartCompositionState) => ({
        root: {
            ...state.root,
            width,
            height
        }
    })),
    getProperty: (id: string, parent: string, propertyOrPath: string) => (state: ChartCompositionState) => {
        let entry = deepFind(state, id, parent)

        while (entry) {
            const val = get(entry, propertyOrPath)
            if (val !== undefined && val !== null) return val
            entry = deepFind(state, "parent" in entry ? entry.parent : null, "root")
        }
        return null
    },
    getData: (id: string) => (state:ChartCompositionState) => {
        const { datasets } = state;
        const timestamp = datasets[id];
        return {
            data: externalDataStore[id],
            id,
            timestamp,
        };
    },
})

const deepFind = (state: ChartCompositionState, id: string | null, parent: string) => {
    if (!id) {
        return null
    } else if (id === "root") {
        return state
    } else if (parent === "root") {
        return state.charts.find(f => f.id === id)
    } else {
        return state.charts.find(f => f.id === parent)?.layers.find(f => f.id === id)
    }
}


class SpecRegistrar {
    datasets: { [key: string]: UpdateTrigger }
    initialized: boolean
    chartLayouts: Array<ChartLayout>
    chartStates: Array<ChartState>
    scales: { [key: ScaleHash]: ScaleState }

    constructor({
        datasets,
        initialized,
        chartLayouts,
        chartStates,
        scales
    }: {
        chartLayouts: SpecRegistrar["chartLayouts"],
        datasets: SpecRegistrar["datasets"],
        initialized: SpecRegistrar["initialized"],
        chartStates: SpecRegistrar["chartStates"],
        scales: SpecRegistrar["scales"]
    }) {
        this.datasets = datasets
        this.initialized = initialized
        this.chartLayouts = chartLayouts
        this.chartStates = chartStates
        this.scales = scales
    }

    upsertChartState(chart: ChartLayout, existingState: ChartState): ChartState {
        const id = existingState ? existingState.id : uid(7)
        return {
            // @ts-ignore
            id,
            ...existingState,
            parent: "root",
            width: chart.width || 100,
            height: chart.height || 100,
            top: chart?.position ?
                "top" in chart.position
                    ? chart.position.top
                    : 100 - chart.position.bottom
                : 0,
            left: chart?.position
                ? "left" in chart.position 
                    ? chart.position.left
                    : 100 - chart.position.right
                : 0,
            scales: existingState?.scales || {},
            layers: chart?.spec?.layers?.length ? chart.spec.layers.map((layer, idx) => this.upsertLayerState(layer, id, existingState.layers[idx])) : [],
            data: existingState?.data || null,
        }
    }

    upsertLayerState(spec: Layer, parent: string, existingLayerState: LayerState) {
        const id = existingLayerState ? existingLayerState.id : uid(7)
        return {
            // @ts-ignore
            id,
            ...existingLayerState,
            parent,
            type: spec.type,
            data: null,
            scales: existingLayerState.scales || {}
        }
    }

    upsertDataset(data: Data | undefined): string | null {
        if (!data) return null
        const { initialized, datasets } = this;
        const dataIndex = Object.entries(externalDataStore).findIndex(storedData => storedData[1] === data)
        if (dataIndex !== -1) {
            return Object.keys(externalDataStore)[dataIndex]
        } else {
            const id = initialized ? Object.keys(externalDataStore)[dataIndex] : uid(7)
            externalDataStore[id] = data
            datasets[id] = new Date().getTime()
            return id
        }
    }
    registerDatasets() {
        const { chartStates, chartLayouts } = this;
        // since the spec objects may have large data attached to them, we want to avoid re-creating the spec objects
        // thus, for of or forEach may slow down the process
        // vs good ol' for loop, which references only
        for (let i = 0; i < chartLayouts.length; i++) {
            const chart = chartLayouts[i];
            chartStates[i] = this.upsertChartState(chart, chartStates[i])
            const { data: chartData, layers } = chart.spec;
            const id = this.upsertDataset(chartData)
            chartStates[i]['data'] = id

            if (layers?.length) {
                for (let j = 0; j < layers.length; j++) {
                    const layer = layers[j];
                    const { data: layerData } = layer;
                    const id = this.upsertDataset(layerData)
                    chartStates[i].layers[j]['data'] = id
                }
            }
        }
    }
    registerScales() {
        const { chartStates, chartLayouts } = this;
        for (let i = 0; i < chartLayouts.length; i++) {
            const chart = chartLayouts[i];
            const scales = chartStates[i].scales
            Object.entries(scales).forEach(([scaleType, scaleSpec]) => {

            })
            chartStates[i] = this.upsertChartState(chart, chartStates[i])
            const { data: chartData, layers } = chart.spec;
            const id = this.upsertDataset(chartData)
            chartStates[i]['data'] = id

            if (layers?.length) {
                for (let j = 0; j < layers.length; j++) {
                    const layer = layers[j];
                    const { data: layerData } = layer;
                    const id = this.upsertDataset(layerData)
                    chartStates[i].layers[j]['data'] = id
                }
            }
        }
    }
}


const useStore = create<Store>(devtools(StoreFunctions))
export { useStore };
