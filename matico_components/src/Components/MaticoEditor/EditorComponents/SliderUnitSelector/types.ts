export type SliderUnitSelectorProps = {
    label: string,
    value: number,
    sliderMin: number,
    sliderMax: number,
    sliderStep: number,
    onUpdateValue: (style: number | {[key:string]: any}) => void,
    sliderUnits?: string,
    sliderUnitsOptions?: {
        key: string,
        label: string
    }[],
    onUpdateUnits?: (value: string) => void,
};
