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
    StatusLight
} from "@adobe/react-spectrum";
import React, { useState } from "react";
import { DatasetModal } from "./DatasetModal";
import { DatasetState, DatasetSummary } from "Datasets/Dataset";
import { useMaticoDispatch, useMaticoSelector } from "Hooks/redux";
import { addDataset } from "Stores/MaticoSpecSlice";
import { DatasetProvider } from "Datasets/DatasetProvider";
import { Dataset as DatasetSpec } from "@maticoapp/matico_types/spec";

interface DatasetEditorProps {
    dataset: DatasetSummary;
}

export const DatasetEditor: React.FC<DatasetEditorProps> = ({ dataset }) => {
    let statusColors: Record<DatasetState, "yellow" | "negative" | "positive"> =
        {
            [DatasetState.LOADING]: "yellow",
            [DatasetState.ERROR]: "negative",
            [DatasetState.READY]: "positive"
        };

    return (
        <DatasetModal dataset={dataset}>
            <Flex
                direction="row"
                gap="small"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
            >
                <Text>{dataset.name}</Text>
                <StatusLight variant={statusColors[dataset.state]} />
            </Flex>
        </DatasetModal>
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
            <ActionButton>Add</ActionButton>
            {(close) => (
                <Dialog>
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
            <Heading margin="size-150" alignSelf="start">
                Datasets
            </Heading>
            <Flex direction="column">
                {Object.entries(datasets).map(([datasetName, dataset]) => {
                    return (
                        <ActionButton width="100%">
                            <DatasetEditor
                                dataset={dataset}
                                key={datasetName}
                            />
                        </ActionButton>
                    );
                })}
            </Flex>
            <NewDatasetModal
                onSubmit={createDataset}
                datasetProviders={datasetProviders}
            />
        </Flex>
    );
};
