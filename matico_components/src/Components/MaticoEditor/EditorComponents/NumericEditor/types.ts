export type NumericEditorProps = {
    label: string;
    value: number;
    step?: number;
    units?: string;
    unitsOptions?: {
        label: string;
        value: string;
    }[];
    onValueChange: (value: number) => void;
    onUnitsChange?: (unit: string) => void;
    isDisabled?: boolean;
}
