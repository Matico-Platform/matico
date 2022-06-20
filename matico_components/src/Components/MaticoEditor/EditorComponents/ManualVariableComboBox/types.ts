import { ReactNode } from "react";

export type ManualVariableComboBoxProps = {
    label: string;
    columns: {name: string; type: string}[];
    onChange: (value: string) => void;
    style: {[variable: string]: string} | any;
    manualIcon?: ReactNode;
    isManual:boolean;
    isDataDriven:boolean;
    isNone:boolean;
}