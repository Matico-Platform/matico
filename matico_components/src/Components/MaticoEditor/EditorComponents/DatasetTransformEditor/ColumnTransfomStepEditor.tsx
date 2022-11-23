import React from "react";
import {
    ActionButton,
    Flex,
    Picker,
    Item,
    Divider,
    Text
} from "@adobe/react-spectrum";
import {
    ColumnTransformStep,
    ColumnTransform
    // @ts-ignore
} from "@maticoapp/matico_types/spec";
import { DatasetColumnSelector } from "Components/MaticoEditor/Utils/DatasetColumnSelector";
import { Column } from "Datasets/Dataset";

interface ColumnTransformEditorProps {
    datasetId: string;
    transform: ColumnTransform;
    columns: Array<Column>;
    onUpdateTransform: (update: Partial<ColumnTransform>) => void;
}

const ColumnTransformEditor: React.FC<ColumnTransformEditorProps> = ({
    datasetId,
    transform,
    columns,
    onUpdateTransform
}) => {
    console.log("transform ", transform, " Columns ", columns);
    return (
        <Flex>
            <DatasetColumnSelector
                datasetName={datasetId}
                columns={columns}
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
    datasetId?: string;
    columns?: Array<Column>;
}> = ({ step, onChange, datasetId, columns }) => {
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
                        columns={columns}
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
