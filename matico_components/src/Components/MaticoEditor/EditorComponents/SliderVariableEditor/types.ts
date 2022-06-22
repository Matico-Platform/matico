export type SliderVariableEditorProps = {
    label: string,
    style: number | {[key:string]: any},
    datasetName: string,
    columns: {name: string,type: string}[],
    sliderMin?: number,
    sliderMax?: number,
    sliderStep?: number,
    onUpdateValue: (style: number | {[key:string]: any}) => void,
    sliderUnits?: string,
    sliderUnitsOptions?: {
        key: string,
        label: string
    }[],
    onUpdateUnits?: (value: string) => void,
};
