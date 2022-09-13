import {
    ActionButton,
    DialogTrigger,
    Flex,
    Heading,
    TextField,
    Well,
    Text,
    Content,
    Dialog,
    TextArea
} from "@adobe/react-spectrum";
import { Dataset, DatasetTransform } from "@maticoapp/matico_types/spec";
import { DatasetSelector } from "Components/MaticoEditor/Utils/DatasetSelector";
import { useApp } from "Hooks/useApp";
import React, { useState } from "react";
import { DatasetTransformDialog, DatasetTransformEditor } from "../DatasetTransformEditor/DatasetTransformEditor";
import { v4 as uuid } from "uuid";
import {useMaticoSelector} from "Hooks/redux";

export const NewDatasetTransformModal: React.FC<{
    onSubmit: (transform: DatasetTransform) => void;
}> = ({ onSubmit }) => {
    const [name, setName] = useState("Transform");
    const [description, setDescription] = useState(
        "Quick description to help you remember what this is"
    );
    const [dataset, setDataset] = useState<string | null>(null);

    const createTransform = (close: ()=>void) => {
        if (dataset) {
            onSubmit({
                id: uuid(),
                name,
                description,
                sourceId: dataset,
                steps: []
            });
            close()
        }
    };

    return (
        <DialogTrigger
            isDismissable
            type="popover"
            containerPadding={0}
            hideArrow
        >
            <ActionButton isQuiet aria-label="Add Map Layer" width="100%">
                Add Transform
            </ActionButton>
            {(close) => (
                <Dialog >
                    <Content >
                        <Flex direction="column" gap="size-200">
                            <TextField
                                width="100%"
                                label="Transform Name"
                                value={name}
                                onChange={setName}
                            />
                            <TextArea
                                width="100%"
                                label="Transform Description"
                                value={description}
                                onChange={setDescription}
                            />
                            <DatasetSelector
                                label="Base datasource for transform"
                                labelPosition={"top"}
                                selectedDataset={dataset}
                                onDatasetSelected={setDataset}
                            />
                            <ActionButton
                            onPress={()=>createTransform(close)}
                                aria-label="Create"
                            >
                                Create Transform
                            </ActionButton>
                        </Flex>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

export const DatasetTransfromPane: React.FC = () => {
    const { datasetTransforms, addDatasetTransform } = useApp();
    const { datasets } = useMaticoSelector((s) => s.datasets);
    return (
        <Flex height="100%" width="100%" direction="column">
            <Heading margin="size-150" alignSelf="start">
                Dataset Transforms
            </Heading>

            <Flex direction="column" gap="size-100">
                {datasetTransforms?.map((transform) => (
                        <DatasetTransformDialog
                            key={transform.id}
                            transformId={transform.id}
                            state={datasets[transform.name]?.state}
                        />
                ))}
            </Flex>

            <NewDatasetTransformModal onSubmit={addDatasetTransform} />
        </Flex>
    );
};
