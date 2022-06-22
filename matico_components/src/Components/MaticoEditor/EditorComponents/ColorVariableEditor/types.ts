export type ColorVariableEditorProps = {
    label: string,
    style: string | number[] | {[key:string]: any},
    datasetName: string,
    columns: {name: string,type: string}[],
    onUpdateStyle: (style: string | {[key:string]: any}) => void,
};
