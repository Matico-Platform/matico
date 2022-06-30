import { ColorSpecification, MappingVarOr } from "@maticoapp/matico_types/spec";

export type ColorVariableEditorProps = {
    label: string,
    style: MappingVarOr<ColorSpecification>,
    datasetName: string,
    columns: {name: string,type: string}[],
    onUpdateStyle: (style: string | {[key:string]: any}) => void,
};
