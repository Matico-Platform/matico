import {
    View,
    Heading,
    ActionButton,
    Flex,
    Text,
    DialogTrigger,
    Dialog,
    Content,
    Tabs,
    Well,
    TabList,
    Item,
    TabPanels,
    StatusLight,
    Divider
} from "@adobe/react-spectrum";
import React, { useState } from "react";
import { DatasetModal } from "./DatasetModal";
import { DatasetState, DatasetSummary } from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { addDataset } from "Stores/MaticoSpecSlice";
import { DatasetProvider } from "Datasets/DatasetProvider";
import { Dataset as DatasetSpec } from "@maticoapp/matico_types/spec";
import { DatasetTransfromPane } from "../EditorComponents/DatasetTransformPane/DatasetTransformPane";
import Delete from "@spectrum-icons/workflow/Delete";
import { useDatasetActions } from "Hooks/useDatasetActions";

interface DatasetEditorProps {
    dataset: DatasetSummary;
}
export const DatasetStatusColors: Record<
    DatasetState,
    "yellow" | "negative" | "positive"
> = {
    [DatasetState.LOADING]: "yellow",
    [DatasetState.ERROR]: "negative",
    [DatasetState.READY]: "positive"
};

export const DatasetEditor: React.FC<DatasetEditorProps> = ({ dataset }) => {
    const { removeDataset } = useDatasetActions(dataset.name);

    return (
        <Flex
            direction="row"
            alignItems="space-between"
            justifyContent="center"
        >
            <DatasetModal dataset={dataset}>
                <Flex
                    direction="row"
                    gap="small"
                    flex={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text>{dataset.name}</Text>
                    <StatusLight variant={DatasetStatusColors[dataset.state]} />
                </Flex>
            </DatasetModal>
            <ActionButton isQuiet onPress={() => removeDataset(dataset.name)}>
                {" "}
                <Delete />{" "}
            </ActionButton>
        </Flex>
    );
};

interface NewDatasetModalProps {
    onSubmit: (datasetParams: DatasetSpec) => void;
    datasetProviders?: Array<DatasetProvider>;
}

const NewDatasetModal: React.FC<NewDatasetModalProps> = ({
    datasetProviders,
    onSubmit
}) => {
    return (
        <DialogTrigger isDismissable>
            <ActionButton isQuiet>Add Dataset</ActionButton>
            {(close) => (
                <Dialog width="70vw">
                    <Content>
                        <Tabs>
                            <TabList>
                                {datasetProviders &&
                                    datasetProviders.map(
                                        (provider: DatasetProvider) => (
                                            <Item key={provider.name}>
                                                {provider.name}
                                            </Item>
                                        )
                                    )}
                            </TabList>
                            <TabPanels>
                                {datasetProviders &&
                                    datasetProviders.map(
                                        (provider: DatasetProvider) => (
                                            <Item key={provider.name}>
                                                <provider.component
                                                    onSubmit={(
                                                        datasetSpec: any
                                                    ) => {
                                                        onSubmit(datasetSpec);
                                                        close();
                                                    }}
                                                />
                                            </Item>
                                        )
                                    )}
                            </TabPanels>
                        </Tabs>
                    </Content>
                </Dialog>
            )}
        </DialogTrigger>
    );
};

interface DatasetsEditorProps {
    datasetProviders?: Array<DatasetProvider>;
}

export const DatasetsEditor: React.FC<DatasetsEditorProps> = ({
    datasetProviders
}) => {
    const { datasets } = useMaticoSelector((s) => s.datasets);
    const [showNewDataset, setShowNewDataset] = useState(false);

    const dispatch = useMaticoDispatch();

    const createDataset = (details: any) => {
        const type = Object.keys(details)[0];
        dispatch(addDataset({ dataset: details }));
        setShowNewDataset(false);
    };

    return (
        <Flex height="100%" width="100%" direction="column">
            <Flex direction="column" gap="size-500">
                <Heading margin="size-150" alignSelf="start">
                    Datasets
                </Heading>
                <Flex direction="column">
                    <>
                        {Object.entries(datasets)
                            .filter(
                                ([datasetName, dataset]) => !dataset.transform
                            )
                            .map(([datasetName, dataset]) => {
                                return (
                                    <>
                                        <DatasetEditor
                                            dataset={dataset}
                                            key={datasetName}
                                        />
                                        <Divider size="S" />
                                    </>
                                );
                            })}
                    </>

                    <NewDatasetModal
                        onSubmit={createDataset}
                        datasetProviders={datasetProviders}
                    />
                </Flex>
            </Flex>
            <Divider size="S" />
            <Flex direction="column">
                <DatasetTransfromPane />
            </Flex>
        </Flex>
    );
};
