import React from "react";
import {
    DialogTrigger,
    ActionButton,
    Dialog,
    Content,
    Flex,
    Picker,
    Item,
    NumberField,
    ToggleButton,
    Divider,
    Text
} from "@adobe/react-spectrum";
import { VariableSelector } from "Components/MaticoEditor/Utils/VariableSelector";
import { Column } from "@maticoapp/matico_types/api/Column";
import {
    FilterStep,
    Filter,
    ColumnTransformStep,
    DateOpts,
    FloatOpts,
    IntOpts,
    ColumnTransform
} from "@maticoapp/matico_types/spec";
import FunctionIcon from "@spectrum-icons/workflow/Function";
import { FilterEditor } from "Components/MaticoEditor/Utils/FilterEditor";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";

interface ColumnTransformEditorProps {
    datasetId: string;
    transform: ColumnTransform;
    onUpdateTransform: (update: Partial<ColumnTransform>) => void;
}

const ColumnTransformEditor: React.FC<ColumnTransformEditorProps> = () => {
    return (
        <Flex>
            <DatasetColumnSelector
                datasetName={datasetId}
                onColumnSelected={(column) => console.log("Column is ", column)}
            />
            to
            <Picker
                items={[
                    { name: "string", id: "string" },
                    { name: "int", id: "int" },
                    { name: "float", id: "float" },
                    { name: "date", id: "date" }
                ]}
            >
                {(item) => <Item key={item.id}>{item.name}</Item>}
            </Picker>
        </Flex>
    );
};

export const ColumnTransformStepEditor: React.FC<{
    step: ColumnTransformStep;
    onChange: (update: Partial<ColumnTransformStep>) => void;
    datasetId: string;
}> = ({ step, onChange, datasetId }) => {
    // const updateTransformAtIndex= (update:Filter,index:number)=>{
    //   console.log("update ", update, " index ", index)
    //   onChange({filters: columnTransformSep.transforms.map((filter:Filter,i:number)=>
    //     index===i ? update : filter
    //                                    )})
    // }
    const addNewTransform = () => {
        onChange({
            transforms: [
                ...step.transforms,
                { column: "", to: { type: "string" } }
            ]
        });
    };

    return (
        <Flex direction="row" gap={"size-300"}>
            <Flex direction="column" width="size-1000">
                <Text>Transform a column in to a different type</Text>
            </Flex>
            <Divider orientation="vertical" size="S" />
            <Flex direction="column" gap="size-200">
                {step.transforms.map((transform: ColumnTransform) => (
                    <ColumnTransformEditor
                        datasetId={datasetId}
                        transform={transform}
                        onUpdateTransform={(update) => console.log(update)}
                    />
                ))}
                <ActionButton onPress={() => addNewTransform()}>
                    Add new
                </ActionButton>
            </Flex>
        </Flex>
    );
};
