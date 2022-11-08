import create from "zustand";
import { ChartspaceEngineSpec } from "../components/ChartSpaces/ChartSpaceEngine";
import { LayerSpec, MarginSpec } from "../components/types";

export type MaticoChartStore = ChartspaceEngineSpec & {
    height: number;
    width: number;
    margins: MarginSpec;
    xMax?: number;
    yMax?: number;
    title?: string;
    subtitle?: string;
    attribution?: string;
    children?: React.ReactNode;
    layers: LayerSpec[];
};

const initialState: MaticoChartStore = {
    data: [],
    type: "continuous",
    layers: [],
    xCol: "",
    yCol: "",
    height: 0,
    width: 0,
    margins: {
        top: 10,
        bottom: 40,
        left: 40,
        right: 10,
    },
};

export type Actions = {
    setDimensions: (width: number, height: number) => any;
    setMultiple: (props: Partial<MaticoChartStore>) => any;
    setState: (update: Partial<MaticoChartStore>) => any;
    setLayerState: (
        props: Partial<LayerSpec | MaticoChartStore>,
        layerIndex: number
    ) => any;
};

export type ChartStoreAndActions = MaticoChartStore & Actions & ChartspaceEngineSpec

const useStore = create<ChartStoreAndActions>((set) => ({
    ...initialState,
    setState: (update) => set((state) => update),
    setDimensions: (height, width) => set((state) => ({ height, width })),
    setMultiple: (newState) => set((state) => ({ ...newState })),
    setLayerState: (update, index) =>
        set((state) => {
            let layers = state?.layers;
            if (!layers || !layers?.[index]) return { layers: [] };
            // @ts-ignore
            layers[index] = { ...layers[index], ...update };
            return { layers };
        }),
}));

export { useStore };
