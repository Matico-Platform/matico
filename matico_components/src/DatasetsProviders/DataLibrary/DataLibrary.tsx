import { Flex, TextField, Button } from "@adobe/react-spectrum";
import {
    DatasetProviderComponent,
    DatasetProvider
} from "Datasets/DatasetProvider";
import React, { useState } from "react";
import { ArrowDataset } from "@maticoapp/matico_types/spec";

export const DataLibrayImporter: React.FC<DatasetProviderComponent> = ({
    onSubmit
}) => {

    const updateOptions = (update: { [option: string]: string }) => {
        setOptions({ ...options, ...update });
    };

    return (
        <Flex direction="column" gap="size-200">
            <TextField
                width="100%"
                label="url"
                value={options.url}
                onChange={(url) => updateOptions({ url })}
            />
            <TextField
                width="100%"
                label="name"
                value={options.name}
                onChange={(name) => updateOptions({ name })}
            />
            <Button
                variant="cta"
                onPress={() => onSubmit({ type: "arrow", ...options })}
            >
                Submit
            </Button>
        </Flex>
    );
};

export const DataLibraryProvider: DatasetProvider = {
    name: "Data Library",
    description: "Load curated datasets in to Matico",
    component: DataLibraryImporter,
    parameterEditor: () => <h1>Not implemented</h1>
};
